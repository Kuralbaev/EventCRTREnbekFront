import { defineStore } from 'pinia'
import { API_URL } from './env'
import axios from 'axios'
import { republic_commissions } from './pages/voting/voting_criteria';

export const useStore = defineStore('store', {
  state: () => ({
    regions: [] as any[],
    nominations: [] as any[],
    currentNomination: null as any,
    user: null as any,
    userType: 'worker',
    company: null as any,
    jwt: null as any,
    language: 'ru',
    certificate: [] as any[],
    voting: false,
    users: [] as any[],
    protocol_users: [] as any[],
    users_nomination: [] as any[],
    votingList: [] as any[],
    votingListRepublic: [] as any[],
    commissions: [] as any[],
  }),

  getters: {
    check_commission: (state) => republic_commissions.find((commission) => commission?.iin === state.user?.iin),
    voting_ids: (state) => state.votingListRepublic?.map((v: any) => v.user.id),
  },

  actions: {
    async fetchUsers(region?: string) {
      if(region) {
        await axios.get(`${API_URL}/api/users?populate=nomination&filters[work_region][$eq]=${region}`).then((res) => {
          this.users = res.data;
        });
        return;
      }
      if(this.check_commission) {
        await axios.get(`${API_URL}/api/users?populate=nomination&filters[work_region][$in]=${this.user.workDistrictRu}`).then((res) => {
          this.users = res.data;
        });
        
      } else {
        await axios.get(`${API_URL}/api/users?populate=nomination`).then((res) => {
          this.users = res.data;
        });
      }
    },
    async fetchUsersNomination() {
      if(this.check_commission) {
        await axios.get(`${API_URL}/api/users-nomination?region=${this.user.workDistrictRu}`).then((res) => {
          this.users_nomination = res.data;
        });
      } else {
        await axios.get(`${API_URL}/api/users-nomination`).then((res) => {
          this.users_nomination = res.data;
        });
      }
    },
    async fetchUsersNominationRepublic() {
        await axios.get(`${API_URL}/api/protocols?populate=users&populate=users.user&populate=users.user.nomination`).then((res) => {
          this.protocol_users = res.data.data.map((protocol: any) =>
            protocol.users.map((user: any) => user.user)
          )
          .flat();
        });
    },

    async fetchCommission(iin?: string) {
        await axios.post('https://interaction.enbek.kz/questionary', {
            "serviceType": "questionary",
            "action": "getCommissions",
            "data": {
                "iin": iin || this?.user?.iin
            }
        },
        {
          headers: {
            'x-api-key': 'Questionary12#$%',
          },
        }).then((res) => {
          this.commissions = res.data.data;
        });
    },

    async fetchVoting() {
      await axios.get(`${API_URL}/api/votings?pagination[pageSize]=10000000000&populate=user&filters[uuid][$contains]=${this?.user?.iin}`).then((res) => {
        this.votingList = res.data.data;
      });
    },

    async fetchVotingRepublic() {
      await axios.get(`${API_URL}/api/republic-votings?pagination[pageSize]=10000000000&populate=user&filters[uuid][$contains]=${this?.user?.iin}`).then((res) => {
        this.votingListRepublic = res.data.data;
      });
    },

    async fetchCertificate(iin: string) {
      const { data } = await axios.get(`https://skills.enbek.kz/api/v2/ru/getCertData/${iin}`,
        {
          headers: {
            'Authorization': 'AtxBRvjb3AM452OEjElIF1LCdUSK9HWpz3ZW6XSfH8zuWLrWBbx4JERt7sTVirja3',
          },
        }
      )
      
      this.certificate = data
    },

    setLanguage(lang: string) {
      this.language = lang
    },

    async fetchRegions() {
      const { data } = await axios.get(`${API_URL}/api/regions`)
      this.regions = data.data
    },

    async fetchNominations() {
      const { data } = await axios.get(`${API_URL}/api/nominations`) 
      this.nominations = data.data
    },

    async fetchUser(user: any) {
      this.user = user
      await this.getUserByIin(user.iin)
    },

    async fetchCompany(company: any) {
      this.company = company
    },

    async getUserById(id: string) {
      const { data: _user } = await axios.get(`${API_URL}/api/users/${id}?populate=*`)
      this.user = {
        ...this.user,
        ..._user,
      }
    },

    async getUserByIin(iin: string) {
      const { data: _user } = await axios.get(`${API_URL}/api/users?filters[iin][$eq]=${iin}&populate=*`)
      
      this.user = {
        ...this.user,
        ..._user[0],
      }
    },

    setUserType(userType: string) {
      this.userType = userType
    },

    async auth() {
      const { data: { jwt } } = await axios.post(`${API_URL}/api/auth/local`, {
        identifier: this.user.email,
        password: 'Aa123456.',
      })
      this.jwt = jwt
      return jwt
    },

    async deleteAccount() {
      const jwt = await this.auth()

      await axios.delete(`${API_URL}/api/users/${this.user.id}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      })

      this.user = null
      this.company = null
    },

    async updateUser(values: any) {
      const jwt = await this.auth()

      values.username = this.user.email

      await axios.put(
        `${API_URL}/api/users/${this.user.id}`,
        values,
        { headers: { Authorization: `Bearer ${jwt}` } }
      )

      this.getUserByIin(this.user.iin)
    },
  },

  persist: true,
})