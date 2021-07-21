export default {
  methods: {
    checkPermission(key) {
      const roles = this.$store.getters.roles
      // 判断roles是否存在(后台问题，新增的用户，没有任何角色，没有任何权限，roles会为null)
      if (roles) {
        return roles.points.includes(key)
      } else {
        return false
      }
    }
  }
}
