const URLMapping = {
    
    LOGIN: '/api/Authen/Login',
    REGISTER: '/api/Authen/Register',

    GET_ALL_CATEGORY: '/api/Category/all',

    GET_ITEMS: '/api/Item',
    ADD_ITEM: '/api/Item',
    UPDATE_ITEM: '/api/Item',
    GET_PERSON_ITEMS: '/api/Item/person',
    GET_ITEMS_HOME: '/api/Item/home',
    
};

export default URLMapping;

const API_URL = import.meta.env.VITE_API_URL as string || "http://localhost:5001";
export { API_URL };