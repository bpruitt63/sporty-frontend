import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

class SportyApi {

    static token;

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
        const res = await this.request(`users/${email}`, data, 'patch');
        return res.user;
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
    static async getOranization(orgId) {
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
        const res = await this.request (`organizations/${orgId}`, {}, 'delete');
        return res.deleted;
    };

    /** Add user to organization */
    static async addUserOrganization(orgId, email, data) {
        const res = await this.request(`users/org${orgId}/${email}`, data, 'post');
        return res.userOrg;
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
};

SportyApi.token = localStorage.getItem("token");

export default SportyApi;