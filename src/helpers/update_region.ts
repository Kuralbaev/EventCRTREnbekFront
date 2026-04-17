import axios from "axios"
import { API_URL } from "../env"

async function getUsers() {
  const { data } = await axios.get(`${API_URL}/api/votings?pagination[pageSize]=10000000000000&filters[voting][$ne]=`)
  return data.data
}

async function getUsersByIin(iin: any) {
  const { data } = await axios.get(`${API_URL}/api/votings?filters[iin][$eq]=${check_iin(iin)}`)
  return data.data
}


const getUser = async (iin: string) => {
    const { data } = await axios.post(
      `https://interaction.enbek.kz/questionary`,
      {
        serviceType: "questionary",
        action: "getByIin",
        data: { iin: iin },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "Questionary12#$%",
        },
      }
    );
    return data.data
  };
  
  const getCompany = async (bin: string) => {
    const user = await axios.post(
      `https://interaction.enbek.kz/questionary`,
      {
        serviceType: "questionary",
        action: "getByBin",
        data: { bin: bin },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "Questionary12#$%",
        },
      }
    );
    return user.data.data
  };

export const check_iin = (iin: string) => {
  const _length = iin.length
  if(_length === 11) {
    return `0${iin}`
  }
  if(_length === 10) {
    return `00${iin}`
  }
  if(_length === 9) {
    return `000${iin}`
  }
  if(_length === 8) {
    return `0000${iin}`
  }
  if(_length === 7) {
    return `00000${iin}`
  }
  if(_length === 6) {
    return `000000${iin}`
  }
  if(_length === 5) {
    return `0000000${iin}`
  }
  if(_length === 4) {
    return `00000000${iin}`
  }
  return iin
}

async function getDataUser(user: any) {
    if(!!user.bin) {
        const data = await getCompany(check_iin(user.bin).toString())
        return data?.districtRu
    }
    if(!!user.iin) {
        const data = await getUser(check_iin(user.iin).toString())
        return data?.workDistrictRu || data?.districtRu
    }
}

async function getDataUserIin(iin: any) {
        const data = await getUser(check_iin(iin).toString())
        return data?.workDistrictRu
}

async function updateUser(id: any, region: any) {
    console.log(id, region);
      const user = await axios.put(`${API_URL}/api/votings/${id}`, {
        data: {
          region: region
        }
      })
      return user
}

export function start() {
  getUsers().then((users) => {
    const _iin = new Set(users.map((user: any) => user.iin))

    console.log(_iin);
    _iin.forEach(async (iin: any) => {
      const _users = await getUsersByIin(iin)
      _users.forEach((e: any) => {
        console.log(!e.voting);
        if(!e.voting){
          console.log(e);
        }
      })
    })
  })
    //   await getDataUserIin(iin).then(async (data) => {
    //     const _list = users.filter((user: any) => +user.iin === +iin)

    //     _list.forEach(async (user: any) => {
    //       if(!!data && data !== user.region){
    //         console.log(data === user.region, data, user.region, user.documentId);
    //         // await updateUser(user.documentId, data || user.region.split(",")[0])
    //       }
    //     })
    //   }).catch(async(err) => {
    //     console.log(iin, null);
    //     // await updateUser(iin, null)
    //   })
    // })
    
    // users.map(async (user: any) => {
    //   await getDataUser(user).then(async (data) => {
    //     await updateUser(user.id, data || user.region.split(",")[0])
    //   }).catch(async(err) => {
    //     await updateUser(user.id, null)
    //   })
    // })
  
}