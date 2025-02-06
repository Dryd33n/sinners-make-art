/**Modify string such that the first letter is capitalized and the rest is left unchanged
 * 
 * @param str string to modify
 * @returns string with first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
    if (!str) return str; // Handle empty string or null
    return str.charAt(0).toUpperCase() + str.slice(1);
  }