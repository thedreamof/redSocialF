<template>
    <q-layout view="hHh lpR fFf" class="bg-grey-1">
        <q-header elevated class="bg-white text-grey-8" height-hint="64">
            <q-toolbar class="GNL__toolbar">
                <q-btn
                    flat
                    dense
                    round
                    @click="toggleLeftDrawer"
                    aria-label="Menu"
                    icon="menu"
                    class="q-mr-sm"
                />

                <q-toolbar-title
                    v-if="$q.screen.gt.xs"
                    shrink
                    class="row items-center no-wrap"
                >
                    <span class="q-ml-sm">Red social</span>
                </q-toolbar-title>

                <q-space />

                <div v-if="user" class="q-gutter-sm row items-center no-wrap">
                    <q-btn round flat>
                        <q-avatar size="26px">
                            <img :src="user.avatar" />
                        </q-avatar>
                        <q-menu>
                            <div class="row no-wrap q-pa-md">
                                <div class="column items-center">
                                    <q-avatar size="72px">
                                        <img :src="user.avatar" />
                                    </q-avatar>

                                    <div class="text-subtitle1 q-mt-md q-mb-xs">
                                        {{ user.username }}
                                    </div>

                                    <q-btn
                                        color="primary"
                                        label="Logout"
                                        push
                                        size="sm"
                                        @click="logout"
                                        v-close-popup
                                    />
                                </div>
                            </div>
                        </q-menu>
                    </q-btn>
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="leftDrawerOpen"
            show-if-above
            bordered
            class="bg-white"
            :width="280"
        >
            <q-scroll-area class="fit">
                <q-list padding class="text-grey-8">
                    <q-item
                        class="GNL__drawer-item"
                        v-ripple
                        v-for="link in links"
                        :key="link.text"
                        :to="link.go"
                        clickable
                    >
                        <q-item-section avatar>
                            <q-icon :name="link.icon" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>{{ link.text }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator inset class="q-my-sm" />

                    <div class="q-mt-md">
                        <div class="flex flex-center q-gutter-xs">
                            <a
                                class="GNL__drawer-footer-link"
                                href="javascript:void(0)"
                                aria-label="About"
                                >2 days free!!</a
                            >
                        </div>
                    </div>
                </q-list>
            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { ref } from 'vue';
import { IUser } from 'src/interfaces/users';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';

export default {
    name: 'MainLayout',

    setup() {
        // --- VARIABLES
        const router = useRouter();
        const leftDrawerOpen = ref(false);
        const search = ref('');
        const local = localStorage.getItem('user') || '';
        const userAuth: IUser = JSON.parse(local) as IUser;
        const user = ref<IUser>();

        const links = [
            { icon: 'web', text: 'Publications', go: 'Publications' },
            { icon: 'person', text: 'Profile', go: 'Profile' },
        ];

        // --- FUNCTIONS

        const getUser = async () => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            user.value = (await api.get(`/users/${userAuth.idUser}`)).data as IUser;
        };

        const toggleLeftDrawer = () => {
            leftDrawerOpen.value = !leftDrawerOpen.value;
        };

        const logout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            void router.push({ name: 'Login' });
        };

        // setInterval(() => {
        //     void getUser();    
        // }, 10000);

        void getUser();

        // --- RETURNS
        return {
            leftDrawerOpen,
            search,
            links,
            toggleLeftDrawer,
            userAuth,
            logout,
            user
        };
    },
};
</script>

<style lang="scss">
.GNL {
    &__toolbar {
        height: 64px;
    }
    &__toolbar-input {
        width: 55%;
    }
    &__drawer-item {
        line-height: 24px;
        border-radius: 0 24px 24px 0;
        margin-right: 12px;

        .q-item__section--avatar {
            .q-icon {
                color: #5f6368;
            }
        }
        .q-item__label {
            color: #3c4043;
            letter-spacing: 0.01785714em;
            font-size: 0.875rem;
            font-weight: 500;
            line-height: 1.25rem;
        }
    }
    &__drawer-footer-link {
        color: inherit;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.75rem;

        &:hover {
            color: #000;
        }
    }
}
</style>
