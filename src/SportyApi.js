import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

class SportyApi {

    static token;

    /** Updates token when updating user info */
    static setToken(newToken) {
        this.token = newToken;
    };

    /** Sends request to database and catches any errors */
    static async request(endpoint, data={}, method="get") {
        const url = `${BASE_URL}/${endpoint}`;
        const headers = {Authorization: `Bearer ${SportyApi.token}`};
        const params = (method === "get") ? data : {};

        try {
            return (await axios({url, method, data, params, headers})).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message;
            !err.response ? message = "Server error, please try again later"
                : message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        };
    };

    /** Register new user and get JWT */
    static async register(data) {
        const res = await this.request('users/register', data, 'post');
        return res.token;
    };

    /** Log in existing user and get JWT */
    static async login(data) {
        const res = await this.request('users/login', data, 'post');
        return res.token;
    };

    /** For super admin to create new user */
    static async create(data) {
        const res = await this.request('users/create', data, 'post');
        return res.user;
    };

    /** Update user */
    static async updateUser(email, data) {
        const {user, token} = await this.request(`users/${email}`, data, 'patch');
        return {user, token};
    };

    /** Get user info */
    static async getUser(email) {
        const res = await this.request(`users/${email}`);
        return res.user;
    };

    /** Search organizations */
    static async searchOrganizations(orgName) {
        const res = await this.request(`organizations/search/${orgName}`);
        return res.orgs;
    };

    /** Get organization info */
    static async getOrganization(orgId) {
        const res = await this.request(`organizations/${orgId}`);
        return res.org;
    };

    /** Update organization name */
    static async updateOrganization(orgId, data) {
        const res = await this.request(`organizations/${orgId}`, data, 'patch');
        return res.org;
    };

    /** Create new organization */
    static async addOrganization(data) {
        const res = await this.request('organizations', data, 'post');
        return res.org;
    };

    /** Delete organization */
    static async deleteOrganization(orgId){
        const {deleted, token} = await this.request (`organizations/${orgId}`, {}, 'delete');
        return {deleted, token};
    };

    /** Add user to organization */
    static async addUserOrganization(orgId, email, data) {
        const {user, token} = await this.request(`users/org${orgId}/${email}`, data, 'post');
        return {user, token};
    };

    /** Get all users tied to an organization */
    static async getAllUsers(orgId) {
        const res = await this.request(`users/org/${orgId}`);
        return res.users;
    };

    /** Change local admin level */
    static async updateLocalAdmin(orgId, email, data){
        const res = await this.request(`users/org${orgId}/${email}`, data, 'patch');
        return res.admin;
    };

    /** Remove user from organization */
    static async removeUserOrganization(orgId, email) {
        const res = await this.request(`users/org${orgId}/${email}`, {}, 'delete');
        return res.userOrg;
    };

    /** Add season title */
    static async addSeason(data, orgId) {
        const res = await this.request(`organizations/${orgId}/seasons`, data, 'post');
        return res.season;
    };

    /** Edit season title */
    static async editSeason(orgId, seasonId, data) {
        const res = await this.request(`organizations/${orgId}/seasons/${seasonId}`, data, 'patch');
        return res.season;
    };

    /** Remove season */
    static async removeSeason(orgId, seasonId) {
        const res = await this.request(`organizations/${orgId}/seasons/${seasonId}`, {}, 'delete');
        return res.deleted;
    };

    /** Get organization's seasons */
    static async getSeasons(orgId) {
        const res = await this.request(`organizations/${orgId}/seasons`);
        return res.seasons;
    };

    /** Get season basic info */
    static async getSeason(orgId, seasonId) {
        const res = await this.request(`organizations/${orgId}/seasons/${seasonId}`);
        return res.season;
    };

    /** Get season's games */
    static async getGames(orgId, seasonId) {
        const res = await this.request(`organizations/${orgId}/seasons/${seasonId}/games`);
        return res.games;
    };

    /** Add teams to database and/or season */
    static async addTeams(data, seasonId, orgId) {
        const res = await this.request(`organizations/${orgId}/seasons/${seasonId}/teams`, data, 'post');
        return res.teams;
    };

    /** Get season's teams */
    static async getTeams(orgId, seasonId) {
        const res = await this.request(`organizations/${orgId}/seasons/${seasonId}/teams`);
        return res.teams;
    };

    /** Add games to season */
    static async addGames(data, orgId, seasonId) {
        const res = await this.request(`organizations/${orgId}/seasons/${seasonId}/games`, data, 'post');
        return res.games;
    };

    /** Edit game */
    static async editGame(game, gameId, orgId, seasonId) {
        const res = await this.request(`organizations/${orgId}/seasons/${seasonId}/games/${gameId}`, game, 'patch');
        return res.game;
    };

    /** Delete game */
    static async deleteGame(orgId, seasonId, gameId) {
        const res = await this.request(`organizations/${orgId}/seasons/${seasonId}/games/${gameId}`, {}, 'delete');
        return res.deleted;
    };
};

SportyApi.token = localStorage.getItem("token");

export default SportyApi;