export default function authHeader() {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr)
    user = JSON.parse(userStr);

  if (user) {
    return `Bearer ${user}`;       // for Node.js Express back-end
  } else {
    return {};
  }
}