<template>
  <v-wrap>
    <v-navigation-drawer  absolute v-model="drawer"  >
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title" router
          :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
       <v-list>
        <v-list-tile v-if="userIsAuthenticated" @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
     <v-toolbar color="blue darken-1">
      <v-toolbar-side-icon
        @click.stop="drawer = !drawer"
        class="hidden-sm-and-up "></v-toolbar-side-icon>
      <v-toolbar-title >
        <router-link to="/" tag="span" style="cursor: pointer" >Yann Mountou</router-link>
        
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
         <v-btn
           v-if="userIsAuthenticated" flat @click="onLogout">
          <v-icon left dark>exit_to_app</v-icon>
          Logout
        </v-btn>
        
      </v-toolbar-items>
   </v-toolbar>
    <main>
      <router-view></router-view>
    </main>
  </v-wrap>
</template>

<script>
  export default {
    data () {
      return {
        drawer: false
         
      }
    },
    computed: {
      menuItems (){
        let menuItems = [
         
          { icon: 'face', title: 'Sign up', link: '/signup' },
          { icon: 'lock_open', title: 'Sign in', link: '/signin' }
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
             { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
             { icon: 'room', title: 'Organize Meetup', link: '/CreateMeetup' },
            { icon: 'person', title: 'Profile', link: '/profile' }
          ]
        }
        return menuItems
      },
      userIsAuthenticated (){
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }

    },
    methods:{
      onLogout(){
        this.$store.dispatch('logout')
      }
    }
  }
</script>


