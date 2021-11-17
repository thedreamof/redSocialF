<template>
    <div class=" q-pa-md row justify-center">
        <!-- <div class="text-h3 text-center" style="width: 100%">
            Welcome to your profile
        </div> -->
        <q-card class="profile" flat bordered>
            <q-card-section horizontal class="justify-evenly items-center">
                <q-card-section class="q-pt-xs">
                    <div class="text-overline">{{ name }} {{ lastname }}</div>
                    <div class="text-h5 q-mt-sm q-mb-xs">{{ username }}</div>
                    <div class="text-caption text-grey">
                        {{ description }}
                    </div>
                </q-card-section>

                <q-card-section class="col-5 flex flex-center">
                    <q-img
                        class="rounded-borders"
                        :src="'https://cdn.quasar.dev/img/avatar.png'"
                    />
                    <!-- <q-avatar>
                        <img src="https://cdn.quasar.dev/img/avatar.png" />
                    </q-avatar> -->
                </q-card-section>
            </q-card-section>

            <q-separator />

            <q-card-actions>
                <q-btn flat round icon="edit" @click="isEditing = !isEditing" />
            </q-card-actions>
        </q-card>

        <q-card v-if="isEditing" flat bordered class="edit-profile">
            <q-card-section>
                <div class="text-h6">Edit your profile</div>
            </q-card-section>

            <q-separator inset />

            <q-card-section>
                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                    <q-input
                        filled
                        v-model="name"
                        label="Your name *"
                        hint="Name"
                        lazy-rules
                        :rules="[
                            (val) =>
                                (val && val.length > 0) ||
                                'Please type youur name',
                        ]"
                    />

                    <q-input
                        filled
                        v-model="lastname"
                        label="Your lastname *"
                        hint="Lastname"
                        lazy-rules
                        :rules="[
                            (val) =>
                                (val && val.length > 0) ||
                                'Please type yoyr lastname',
                        ]"
                    />

                    <q-input
                        filled
                        v-model="username"
                        label="Your username *"
                        hint="Username"
                        disable
                        lazy-rules
                        :rules="[
                            (val) =>
                                (val && val.length > 0) ||
                                'Please type your username',
                        ]"
                    />

                    <q-input
                        type="textarea"
                        filled
                        v-model="description"
                        label="Your description *"
                        hint="Description"
                        lazy-rules
                        :rules="[
                            (val) =>
                                (val && val.length > 0) ||
                                'Please type your description',
                        ]"
                    />

                    <div>
                        <q-btn label="Submit" type="submit" color="primary" />
                        <q-btn
                            label="Reset"
                            type="reset"
                            color="primary"
                            flat
                            class="q-ml-sm"
                        />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>

        <div class="publication-content flex justify-center q-gutter-md">
            <q-card
                class="publication"
                v-for="(item, index) in publications"
                :key="item"
            >
                <q-item>
                    <q-item-section avatar>
                        <q-avatar>
                            <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>{{
                            item.userCreated.username
                        }}</q-item-label>
                        <q-item-label caption>{{ item.title }}</q-item-label>
                    </q-item-section>

                    <q-item-section>
                        <q-card-actions horizontal class="justify-end q-px-md">
                            <q-item-label caption>{{
                                item.createAt
                            }}</q-item-label>
                            <q-btn
                                flat
                                round
                                color="red"
                                icon="favorite"
                                @click="giveLike(item, index)"
                            >
                                <q-badge color="red" floating transparent>{{
                                    item.likes.length
                                }}</q-badge>
                            </q-btn>
                        </q-card-actions>
                    </q-item-section>
                </q-item>

                <!-- <img src="https://cdn.quasar.dev/img/parallax2.jpg" /> -->

                <q-card-section>
                    {{ item.description }}
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { IUser } from 'src/interfaces/users';
import { IPublication } from 'src/interfaces/publications';

export default defineComponent({
    name: 'Profile',
    setup() {
        // --- VARIABLES
        const $q = useQuasar();
        const router = useRouter();
        const form = reactive({
            avatar: '',
            name: '',
            lastname: '',
            username: '',
            description: '',
        });
        const isEditing = ref(false);
        const publications = ref<Array<IPublication>>([]);
        const userAuth = JSON.parse(
            localStorage.getItem('user') || ''
        ) as IUser;

        // --- FUNCTIONS
        const getUser = async () => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const res = (await api.get(`/users/${userAuth.username}`))
                .data as IUser;
            console.log(res);

            form.avatar = res.avatar || '';
            form.name = res.name || '';
            form.lastname = res.lastname || '';
            form.username = res.username || '';
            form.description = res.description || '';
        };

        const getPublications = async () => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const res: Array<IPublication> = (
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                await api.get(`/publications/user/${userAuth.idUser}`)
            ).data as Array<IPublication>;

            console.log('RES', res);
            if (!res) return;

            let publicationsSort = res.sort(
                (a: IPublication, b: IPublication) => {
                    return (
                        new Date(b.createAt).getTime() -
                        new Date(a.createAt).getTime()
                    );
                }
            );

            publicationsSort = publicationsSort.map((x) => {
                x.createAt = new Date(x.createAt).toLocaleString();
                return x;
            });

            publications.value = publicationsSort;
        };

        const onSubmit = async () => {
            const params = {
                avatar: form.avatar,
                name: form.name,
                lastname: form.lastname,
                username: form.username,
                description: form.description,
            };

            try {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                const res: unknown = (await api.put(`users/${userAuth.idUser}`, params)).data;
                if (res) {
                    $q.notify({
                        color: 'green-4',
                        textColor: 'white',
                        icon: 'cloud_done',
                        message: 'Successfull!!',
                    });
                }

                void getUser();
                isEditing.value = false;
            } catch (error) {
                $q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'error',
                    message: 'Error try again',
                });
            }
        };

        const onReset = () => {
            form.avatar = '';
            form.name = '';
            form.lastname = '';
            form.username = '';
            form.description = '';
        };

        const giveLike = async (publication: IPublication, index: number) => {
            const liked = publication.likes.findIndex(
                (x) => x.idUser === userAuth.idUser
            );
            if (liked < 0) {
                const res: IPublication = (
                    await api.put(
                        `publications/${publication._id}/addLike`,
                        userAuth
                    )
                ).data as IPublication;
                publications.value[index] = res;
            } else {
                // (await api.post('deleteLike')).data;
                const res: IPublication = (
                    await api.put(
                        `publications/${publication._id}/deleteLike`,
                        userAuth
                    )
                ).data as IPublication;
                publications.value[index] = res;
            }
        };

        // --- Initial functions
        void getUser();
        void getPublications();

        // --- RETURNS
        return { ...toRefs(form), onSubmit, onReset, isEditing, publications, giveLike };
    },
});
</script>

<style lang="scss" scoped>
.profile {
    width: 100%;
    height: 100%;
    max-width: 700px;
    // height: ;
}
.edit-profile {
    width: 100%;
    height: 100%;
    max-width: 700px;
}

.publication-content {
    padding-top: 15px;
    width: 100%;
    height: 100%;
}

.publication {
    width: 100%;
    height: 100%;
    max-width: 600px;
}
</style>
