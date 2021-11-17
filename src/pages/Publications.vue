<template>
    <!-- <div class="q-page q-pa-md row justify-center items-center q-gutter-md"> -->
    <q-page padding class="q-gutter-md row justify-center">
        <div class="q-pa-md" style="width: 700px">
            <p class="text-h6">Hey tell us something...</p>
            <q-form @submit="onSubmit" class="q-gutter-md">
                <q-input filled v-model="title" label="Title (optional)" />

                <q-input
                    type="textarea"
                    filled
                    v-model="description"
                    label="What do you want to tell us?"
                    lazy-rules
                    :rules="[
                        (val) =>
                            (val && val.length > 0) || 'Please type something',
                    ]"
                />

                <div>
                    <q-btn label="Public" type="submit" color="primary" />
                </div>
            </q-form>
        </div>

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
    </q-page>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { IPublication, IUser } from 'src/interfaces/publications';

export default defineComponent({
    name: 'Publications',
    setup() {
        // --- VARIABLES
        const publications = ref<Array<IPublication>>([]);
        const user = localStorage.getItem('user') || '';
        const userAuth = (JSON.parse(user) as IUser) || null;
        const form = reactive({
            title: '',
            description: '',
        });

        // --- FUNCTIONS
        const getPublications = async () => {
            const res: Array<IPublication> = (await api.get('/publications'))
                .data as Array<IPublication>;

            let publicationsSort = res.sort((a: IPublication, b: IPublication) => {
				return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
			});

            publicationsSort = publicationsSort.map((x) => {
                x.createAt = new Date(x.createAt).toLocaleString();
                return x;
            });

            publications.value = publicationsSort;

        };

        const reset = () => {
            form.title = '';
            form.description = '';
        };

        const onSubmit = async () => {
            const params = { ...form, userCreated: userAuth };
            const res: IPublication = (await api.post('/publications', params))
                .data as IPublication;
            if (res) {
                reset();
                void getPublications();
            }
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

        // --- initial functions
        void getPublications();

        // --- RETURNS
        return { publications, giveLike, ...toRefs(form), onSubmit };
    },
});
</script>

<style lang="scss" scoped>
.publication-content {
    width: 100%;
    height: 100%;
    // display: flex;
    // justify-content: center;
    // flex-wrap: wrap;
    // gap: 15px;
}

.publication {
    width: 100%;
    height: 100%;
    max-width: 600px;
}
</style>
