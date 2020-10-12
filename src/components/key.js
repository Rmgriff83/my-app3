function getId(len) {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    let val = "";
    for (let i = 0; i < len; ++i) {
      val += chars[Math.floor(Math.random() * chars.length)];
    }
    return val;
  }
  
  export default getId;
  