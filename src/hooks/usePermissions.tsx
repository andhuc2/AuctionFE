import { useEffect, useState } from "react";
import useService from "./useService";
import URLMapping from "../utils/URLMapping";
import PermissionMapping from "../utils/PermissionMapping";

interface PermissionsContext {
  permissions: string[];
  hasPermission: (permission: string | undefined) => boolean;
  fetchPermissions: () => Promise<void>;
}

const PERMISSIONS_CACHE_KEY = "user_permissions";

const usePermissions = (): PermissionsContext => {
  const [permissions, setPermissions] = useState<string[]>([]);

  // Function to fetch permissions from the API and cache them
  const fetchPermissions = async () => {
    // Check if permissions are cached in localStorage
    const cachedPermissions = localStorage.getItem(PERMISSIONS_CACHE_KEY);

    if (cachedPermissions) {
      setPermissions(JSON.parse(cachedPermissions));
      return;
    }

    // Fetch permissions from API
    setPermissions(["*"]);
    // Cache the permissions in localStorage
    localStorage.setItem(PERMISSIONS_CACHE_KEY, JSON.stringify(["*"]));
  };

  // Function to check if the user has a specific permission
  const hasPermission = (permission: string | undefined) => {
    if (!permission) return true;
    const hasPerm =
      permissions.includes(permission) ||
      permissions.includes(PermissionMapping.ADMIN_PERMISSION);

    if (!hasPerm) {
      // localStorage.removeItem(PERMISSIONS_CACHE_KEY);
    }
    return hasPerm;
  };

  // Fetch permissions when the hook is first used
  useEffect(() => {
    fetchPermissions();
  }, []);

  return { permissions, hasPermission, fetchPermissions };
};

export default usePermissions;
