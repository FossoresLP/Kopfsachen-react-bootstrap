//const baseUrl = "https://auth.api.live.mindtastic.lol";
import MD5 from "crypto-js/md5"
const baseUrl = "/api";
const apiCalls = {

    baseUrl: baseUrl,

    initRegistration: async() => {
        return _fetchGET('/self-service/registration/browser', true)
    },

    submitRegistration: async(re) => {

        return _fetchPOST('/self-service/registration?flow=' + new URL(re.ui.action).searchParams.get("flow"), {
            "method": "password",
            "csrf_token": await re.ui.nodes.filter(x => x.attributes.name === "csrf_token").map(x => x.attributes.value)[0]
        })
    },

    initLogin: async() => {
        return _fetchGET('/self-service/login/browser', true)
    },

    submitLogin: async(re, key) => {
        return _fetchPOST('/self-service/login?flow=' + new URL(re.ui.action).searchParams.get("flow"), {
            "method": "password",
            "csrf_token": await re.ui.nodes.filter(x => x.attributes.name === "csrf_token").map(x => x.attributes.value)[0],
            "identifier": key,
            "password": MD5(key).toString()
        })
    },

    initLogout: async() => {
        return _fetchGET('/self-service/logout/browser', true)
    },

    submitLogout: async(token) => {
        return _fetchGET('/self-service/logout?token=' + token, false)
    },

    checkSession: async() => {
        return _fetchGET('/sessions/whoami', true)
    },

    getWiki: async() => {
        return _fetchGET('/wiki', true)
    },

    getUser: async() => {
        return _fetchGET('/user', true)
    },

};

export default apiCalls

async function _fetchGET(path, res) {
    const response = await fetch(baseUrl + path, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    if (res) {
        const r = await response.json();
        console.log(r)
        return r;
    }
};


async function _fetchPOST(path, bodyobj) {
    const response = await fetch(baseUrl + path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"

        },
        body: JSON.stringify(bodyobj)
    });
    const r = await response.json();
    console.log(r)
    return r
};