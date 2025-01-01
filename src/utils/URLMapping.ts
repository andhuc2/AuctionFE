const URLMapping = {
    
    LOGIN: '/api/Authen/Login',
    REGISTER: '/api/Authen/Register',

    GET_ALL_CATEGORY: '/api/Category/all',

    GET_ITEMS: '/api/Item',
    ADD_ITEM: '/api/Item',
    UPDATE_ITEM: '/api/Item',
    DELETE_ITEM: '/api/Item',
    GET_PERSON_ITEMS: '/api/Item/person',
    GET_ITEMS_HOME: '/api/Item/home',

    GET_USER: '/api/User',
    DELETE_USER: '/api/User',
    UPDATE_USER: '/api/User',

    GET_CATEGORY: '/api/Category',
    ADD_CATEGORY: '/api/Category',
    UPDATE_CATEGORY: '/api/Category',
    DELETE_CATEGORY: '/api/Category',

    POST_BID: '/api/Bid',
    
    POST_RATING: '/api/Rating',
    GET_RATING: '/api/Rating',
};

export default URLMapping;

const API_URL = import.meta.env.VITE_API_URL as string || "http://localhost:5001";
export { API_URL };