<template>
  <div class="navbar" :style="{background: $store.state.settings.theme}">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="app-breadcrumb">
      {{ $t('navbar.title') }}
      <span class="breadBtn">{{ $t ('navbar.enjoy') }}</span>
    </div>
    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <!-- 中英文切换语言包组件 -->
      <Lang class="right-menu-item" />
      <!-- 全屏组件 -->
      <ScreenFull class="right-menu-item" />
      <!-- 放置换肤插件 -->
      <ThemePicker class="right-menu-item" style="padding-top: 11px" @change="changeTheme" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-imgerror="defaultImg" :src="staffPhoto" class="user-avatar">
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color:#fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com/zhenwei_guo/hrsaas/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="clicklogout">
            <span v-color="color" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Img from '@/assets/common/leiou.jpeg'
import ScreenFull from '@/components/ScreenFull/index.vue'
import ThemePicker from '@/components/ThemePicker/index.vue'
import Lang from '@/components/Lang'
export default {
  components: {
    Hamburger,
    ScreenFull,
    ThemePicker,
    Lang

  },
  data() {
    return {
      defaultImg: Img,
      color: 'red'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'staffPhoto',
      'routes'
    ])
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    ...mapActions('user', (['getUserInfo', 'logout'])),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    clicklogout() {
      this.logout()
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    // 同步到 vuex 中, 提交了action
    changeTheme(val) {
      // 发布action,同步主题色到vuex中
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);

.app-breadcrumb {
  display: inline-block;
  font-size: 18px;
  line-height: 50px;
  margin-left: 10px;
  color: #ffffff;
  cursor: text;
  .breadBtn {
    background: #84a9fe;
    font-size: 14px;
    padding: 0 10px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    margin-left: 15px;
  }
}
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    .right-menu-item {
  vertical-align: middle !important;
}
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        .name {
          cursor: pointer;
          color: #fff;
          vertical-align: middle;
         margin-left:5px;
        }
      .user-dropdown {
        color: #fff;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
