export default {
  check(){
    let token = this.get()
    if (!token) {
      return false
    }
    return true
  },
  save(token){
    localStorage.setItem("token", token)
  },
  get(){
    return localStorage.getItem("token")
  },
}
