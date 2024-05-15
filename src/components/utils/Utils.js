export function formatDate(inputDate) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const parts = inputDate.split('/')
  const year = parts[0]
  const month = parseInt(parts[1], 10) - 1
  const day = parts[2]

  const formattedDate = `${day}th ${months[month]} ${year}`

  return formattedDate;
}

export const LINK_REGEX = /(?:https?|ftp):\/\/[\n\S]+/gi;

export function stringHasLink(s) {
  return LINK_REGEX.test(s)
}