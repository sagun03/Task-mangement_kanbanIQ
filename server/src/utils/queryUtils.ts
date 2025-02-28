// utils/queryUtils.js
export const parseIdsFromQuery = (ids: string | string[] | any): string[] => {
    // If ids is already an array, return it as is
    if (Array.isArray(ids)) {
      return ids;
    }
  
    // If ids is a comma-separated string, split it into an array
    if (typeof ids === 'string') {
      return ids.split(',').map(id => id.trim()); // Split and trim any spaces
    }
  
    // If ids is invalid, return an empty array or throw an error
    return [];
  }
  