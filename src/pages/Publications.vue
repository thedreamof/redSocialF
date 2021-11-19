<template>
    <!-- <div class="q-page q-pa-md row justify-center items-center q-gutter-md"> -->
    <q-page padding class="q-gutter-md row justify-center">
        <div v-if="loading">
            <q-spinner-puff color="primary" size="2em" />
            <q-tooltip :offset="[0, 8]">QSpinnerPuff</q-tooltip>
        </div>
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
            <Publication
                v-for="(item, index) in publications"
                :key="item"
                :publication="item"
                @giveLike="giveLike(index, $event)"
                @addComment="addComment(index, $event)"
            />

            <!-- <q-card
                class="publication"
                v-for="(item, index) in publications"
                :key="item"
            >
                <q-item>
                    <q-item-section avatar>
                        <q-avatar>
                            <img :src="item.userCreated.avatar" />
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

                <q-card-section>
                    <div>
                        {{ item.description }}
                    </div>
                    <q-card-actions horizontal class="justify-end q-px-md">
                        <q-chip clickable icon="comment">Comment</q-chip>
                    </q-card-actions>
                </q-card-section>

                <q-card-section>

                </q-card-section>
            </q-card> -->
        </div>
    </q-page>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { IComment, IPublication, IUser } from 'src/interfaces/publications';
import Publication from 'src/components/Publication.vue';

export default defineComponent({
    name: 'Publications',
    components: {
        Publication,
    },
    setup() {
        // --- VARIABLES
        const publications = ref<Array<IPublication>>([]);
        const user = localStorage.getItem('user') || '';
        // console.log('Usuario', user);
        const userAuth = JSON.parse(user) as IUser;
        const form = reactive({
            title: '',
            description: '',
        });
        console.log('UserAuth', userAuth);
        const loading = ref(true);

        // --- FUNCTIONS

        const sortPublication = (publication: IPublication[]) => {
            let publicationsSort: IPublication[] = publication.sort(
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

            return publicationsSort;
        };

        const sortComments = (comments: IComment[]) => {
            let commentsSort: IComment[] = comments.sort(
                (a: IComment, b: IComment) => {
                    return (
                        new Date(b.createAt).getTime() -
                        new Date(a.createAt).getTime()
                    );
                }
            );

            commentsSort = commentsSort.map((x) => {
                x.createAt = new Date(x.createAt).toLocaleString();
                return x;
            });

            return commentsSort;
        };

        const getPublications = async () => {
            loading.value = true;
            const res: Array<IPublication> = (await api.get('/publications'))
                .data as Array<IPublication>;

            let sorted = sortPublication(res);
            sorted = sorted.map((x) => {
                x.comments = sortComments(x.comments);
                return x;
            });

            publications.value = sorted;
            loading.value = false;
        };

        const reset = () => {
            form.title = '';
            form.description = '';
        };

        const onSubmit = async () => {
            loading.value = true;
            const params = { ...form, userCreated: userAuth };
            const res: IPublication = (await api.post('/publications', params))
                .data as IPublication;
            if (res) {
                reset();
                void getPublications();
            }
            loading.value = false;
        };

        const giveLike = (index: number, liked: IPublication) => {
            publications.value[index] = liked;
        };

        const addComment = (index: number, comment: IPublication) => {
            publications.value[index] = comment;
        };

        // --- initial functions
        void getPublications();

        // --- RETURNS
        return {
            publications,
            giveLike,
            ...toRefs(form),
            onSubmit,
            addComment,
            loading,
        };
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
</style>
