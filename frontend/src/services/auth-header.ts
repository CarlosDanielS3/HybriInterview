export default function authHeader() {
  const userStr = localStorage.getItem("user");
  let user = null;
  console.log(localStorage);
  if (userStr)
    user = JSON.parse(userStr);

  if (user && user.token) {
    console.log(`Bearer ${user.token}`);
    return `Bearer ${user.token}`;       // for Node.js Express back-end
  } else {
    return {};
  }
}