const MENU_ITEMS = require("../config/Menu/menuRegistry")
const ROLE_MENU_MAP = require("../config/Menu/roleMenuMap")
/**
                            */
function getMenuForRole(role){
    //console.log(role);
    const menuKeys = ROLE_MENU_MAP[role];
    if(!menuKeys) return [];
    const role_map_array = ROLE_MENU_MAP[role]  
                            .map((key) => MENU_ITEMS[key]) 
                            .map((obj) => ({
                                ...obj,
                                ["children"]: obj.children? obj.children.map((key) => MENU_ITEMS[key]) : undefined
                            }))
    //console.log(role_map_array);
    return role_map_array;
}

module.exports = getMenuForRole;