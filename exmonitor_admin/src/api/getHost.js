const NODE_ENV = process.env.NODE_ENV;
const envUrl = {
    development: {
        apiUrl: 'http://localhost:8086',
    },
    production: {
        apiUrl: 'http://lijiawei.com.cn:8086',
    }
}

const getHost = () => {
    return envUrl[NODE_ENV].apiUrl;
}

export default getHost;