import { NCALayerClient } from "ncalayer-js-client";
import { message } from "ant-design-vue";

function xmlToBase64(xml: string): string {
  const bytes = new TextEncoder().encode(xml);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function ensureDataRoot(xml: string): string {
  const trimmed = xml.trim();

  if (trimmed.includes("<data") && /<\s*data[\s>]/.test(trimmed)) {
    return trimmed;
  }

  if (/<\s*root[\s>]/.test(trimmed)) {
    return trimmed
      .replace(/<\s*root(\s[^>]*)?>/i, "<data>")
      .replace(/<\s*\/\s*root\s*>/i, "</data>");
  }

  return `<data>${trimmed}</data>`;
}

export async function connectAndSign(
  xmlToSign = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><data><time>${Date.now()}</time></data>`
) {
    const ncalayerClient = new NCALayerClient();
  
    try {
      await ncalayerClient.connect();
    } catch (error) {
      message.error(`Не удалось подключиться к NCALayer`);
      alert(`Не удалось подключиться к NCALayer: ${error.toString()}`);
      throw error;
    }
  
    const normalizedXml = ensureDataRoot(xmlToSign);
    let signedXml;
    try {
      signedXml = await ncalayerClient.basicsSignXML(
        NCALayerClient.basicsStorageAll,
        normalizedXml,
        NCALayerClient.basicsXMLParams,
        NCALayerClient.basicsSignerSignAny
      );
      // Возвращает формат: { signedXML: "<base64 signed xml>" }
      
      return {
        xmlData: xmlToBase64(signedXml),
      };
    } catch (error) {
      throw error;
    }
  }
  // 28121995Ee
  // Функция для извлечения данных пользователя из CMS подписи ncalayer-js-client
  function extractUserDataFromCMS(cmsSignature) {
    try {
      // Очищаем подпись от заголовков
      const cleanSignature = cmsSignature
        .replace(/-----BEGIN CMS-----/g, "")
        .replace(/-----END CMS-----/g, "")
        .replace(/\s/g, "");
  
      // Декодируем Base64
      const binaryString = atob(cleanSignature);
      const bytes = new Uint8Array(binaryString.length);
  
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
  
      // Извлекаем текстовые данные
      let textData = "";
      for (let i = 0; i < bytes.length; i++) {
        const byte = bytes[i];
        if (byte >= 32 && byte <= 126) {
          textData += String.fromCharCode(byte);
        } else {
          textData += " ";
        }
      }
  
      // Парсим данные пользователя
      const userData = {
        fullName: "",
        surname: "",
        givenName: "",
        iin: "",
        email: "",
        country: "",
        validFrom: "",
        validTo: "",
        signatureTimestamp: "",
        isValid: false,
        daysUntilExpiry: 0,
        birthDate: "",
        gender: "",
        age: 0,
        bin: ""
      };

      // parse keyUser
      const jsonData =  textData.match(/keyUser\s*=\s*(\{.*\})/);
      console.log(jsonData);
      
      
      // Поиск ФИО
      const fioMatch = textData.match(/FIO(\w+)\s+(\w+)\s+(\w+)/);
      if (fioMatch) {
        userData.surname = fioMatch[1];
        userData.givenName = fioMatch[2];
        userData.fullName = `${userData.surname} ${userData.givenName}`;
      }

      // Поиск email
      const emailMatch = textData.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      );
      if (emailMatch) {
        userData.email = emailMatch[0];
  
        // Извлекаем имя из email
        const emailPrefix = userData.email.split("@")[0];
        const nameParts = emailPrefix
          .replace(/[^a-zA-Z]/g, " ")
          .trim()
          .split(/\s+/);
        if (nameParts.length >= 2) {
          userData.surname = capitalize(nameParts[0]);
          userData.givenName = capitalize(nameParts[1]);
          userData.fullName = `${userData.surname} ${userData.givenName}`;
        }
      }
  
      // Поиск ИИН
      const iinMatch = textData.match(/IIN(\d{12})/);
      if (iinMatch) {
        userData.iin = iinMatch[1];
  
        // Анализ ИИН
        const iinAnalysis = analyzeIIN(userData.iin);
        if (iinAnalysis) {
          userData.birthDate = iinAnalysis.birthDate;
          userData.gender = iinAnalysis.gender;
          userData.age = iinAnalysis.age;
        }
      }
  
      // Поиск BIN
      const binMatch = textData.match(/BIN(\d{12})/);
      if (binMatch) {
        userData.bin = binMatch[1];
  
        // Анализ ИИН
        const binAnalysis = analyzeBIN(userData.bin);
        if (binAnalysis) {
          userData.bin = binAnalysis.bin;
        }
      }
  
      // Поиск страны
      if (textData.includes("KZ")) {
        userData.country = "KZ";
      }
  
      // Поиск дат сертификата
      const dateMatches = textData.match(/(\d{12})Z/g);
      if (dateMatches && dateMatches.length >= 2) {
        // Первые две даты обычно валидность сертификата
        userData.validFrom = formatCertificateDate(dateMatches[0]);
        userData.validTo = formatCertificateDate(dateMatches[1]);
  
        // Проверяем валидность
        const now = new Date();
        const validToDate = new Date(userData.validTo);
        userData.isValid = now <= validToDate;
        userData.daysUntilExpiry = Math.ceil(
          (validToDate - now) / (1000 * 60 * 60 * 24)
        );
      }
  
      // Поиск времени подписи
      const signatureTimeMatch = textData.match(/(\d{14})Z/);
      if (signatureTimeMatch) {
        userData.signatureTimestamp = formatSignatureDate(signatureTimeMatch[1]);
      }
  
      return userData;
    } catch (error) {
      console.error("Ошибка извлечения данных из CMS:", error);
      return null;
    }
  }
  
  // Вспомогательная функция для анализа ИИН
  function analyzeIIN(iin) {
    if (!iin || iin.length !== 12) return null;
  
    try {
      const birthDate = iin.substring(0, 6);
      const century = iin.charAt(6);
  
      let yearPrefix = "";
      let genderText = "";
  
      switch (century) {
        case "1":
        case "2":
          yearPrefix = "18";
          genderText = century === "1" ? "мужской" : "женский";
          break;
        case "3":
        case "4":
          yearPrefix = "19";
          genderText = century === "3" ? "мужской" : "женский";
          break;
        case "5":
        case "6":
          yearPrefix = "20";
          genderText = century === "5" ? "мужской" : "женский";
          break;
        case "9":
        case "0":
          yearPrefix = "19";
          genderText = century === "9" ? "мужской" : "женский";
          break;
        default:
          return null;
      }
  
      const year = yearPrefix + birthDate.substring(0, 2);
      const month = birthDate.substring(2, 4);
      const day = birthDate.substring(4, 6);
  
      return {
        birthDate: `${day}.${month}.${year}`,
        gender: genderText,
        age: new Date().getFullYear() - parseInt(year),
      };
    } catch (error) {
      console.error("Ошибка анализа ИИН:", error);
      return null;
    }
  }

  function analyzeBIN(bin) {
    if (!bin || bin.length !== 12) return null;

    return {
      bin: bin,
    };
  }
  
  // Форматирование даты сертификата (YYMMDDHHMMSS)
  function formatCertificateDate(dateString) {
    try {
      const cleanDate = dateString.replace("Z", "");
      if (cleanDate.length >= 12) {
        const year = "20" + cleanDate.substring(0, 2);
        const month = cleanDate.substring(2, 4);
        const day = cleanDate.substring(4, 6);
        const hour = cleanDate.substring(6, 8);
        const minute = cleanDate.substring(8, 10);
        const second = cleanDate.substring(10, 12);
  
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      }
    } catch (error) {
      console.error("Ошибка форматирования даты сертификата:", error);
    }
    return dateString;
  }
  
  // Форматирование даты подписи (YYYYMMDDHHMMSS)
  function formatSignatureDate(dateString) {
    try {
      if (dateString.length >= 14) {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        const hour = dateString.substring(8, 10);
        const minute = dateString.substring(10, 12);
        const second = dateString.substring(12, 14);
  
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      }
    } catch (error) {
      console.error("Ошибка форматирования даты подписи:", error);
    }
    return dateString;
  }
  
  // Капитализация первой буквы
  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  // Обновленная функция для интеграции с ncalayer-js-client
  async function connectSignAndExtractUserData() {
    const ncalayerClient = new NCALayerClient();
  
    try {
      // Подключение к NCALayer
      await ncalayerClient.connect();
      console.log("Подключение к NCALayer успешно");
    } catch (error) {
      console.error(`Не удалось подключиться к NCALayer: ${error.toString()}`);
      alert(`Не удалось подключиться к NCALayer: ${error.toString()}`);
      return null;
    }
  
    const xmlToSign = `<root><data>test</data></root>`;
    let signedXml;
  
    try {
      // Выполняем XMLDSig подпись (результат - подписанный XML)
      signedXml = await ncalayerClient.basicsSignXML(
        NCALayerClient.basicsStorageAll,
        xmlToSign,
        NCALayerClient.basicsXMLParams,
        NCALayerClient.basicsSignerSignAny
      );
  
      console.log("Подпись создана успешно");
  
      // Для XMLDSig возвращаем сам подписанный XML.
      return {
        success: true,
        userInfo: {
          signatureCreated: true,
          signatureTimestamp: new Date().toISOString(),
        },
        signature: signedXml,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error.canceledByUser) {
        alert("Действие отменено пользователем.");
        return { success: false, canceled: true };
      }
  
      console.error("Ошибка при создании подписи:", error);
      alert(error.toString());
      return { success: false, error: error.toString() };
    }
  }
  
  // // Функция для тестирования с предоставленной CMS подписи
  // function testWithProvidedCMS() {
  //   const testSignature = `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`;
  
  //   console.log("Тестируем извлечение данных из предоставленной CMS подписи...");
  //   const userData = extractUserDataFromCMS(testSignature);
  
  //   if (userData) {
  //     console.log("Результат извлечения данных:", userData);
  //     const validation = validateUserData(userData);
  //     console.log("Результат валидации:", validation);
  //     return userData;
  //   } else {
  //     console.error("Не удалось извлечь данные из тестовой подписи");
  //     return null;
  //   }
  // }
  
  // // Запуск анализа
  // const userData = testWithProvidedCMS();
  // console.log("Результат анализа:", userData);