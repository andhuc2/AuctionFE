const PermissionMapping = {
    //Free to all
    NONE: 'NONE',

    //Admin
    ADMIN_PERMISSION: '*',

    VIEW_USER: 'view_user',
    ADD_USER: 'add_user',
    EDIT_USER: 'edit_user',

    VIEW_LEADERBOARD: 'view_leaderboard',
    RESET_LEADERBOARD: 'reset_leaderboard',

    VIEW_TOURNAMENT: 'view_tournament',
    ADD_TOURNAMENT: 'add_tournament',
    EDIT_TOURNAMENT: 'edit_tournament',
    DELETE_TOURNAMENT: 'delete_tournament',
}

export default PermissionMapping;