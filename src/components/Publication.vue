<template>
    <q-card class="publication">
        <q-item>
            <q-item-section avatar>
                <q-avatar>
                    <img :src="publication.userCreated.avatar" />
                </q-avatar>
            </q-item-section>

            <q-item-section>
                <q-item-label>{{
                    publication.userCreated.username
                }}</q-item-label>
                <q-item-label caption>{{ publication.title }}</q-item-label>
            </q-item-section>

            <q-item-section>
                <q-card-actions horizontal class="justify-end q-px-md">
                    <q-item-label caption>{{
                        publication.createAt
                    }}</q-item-label>
                    <q-btn
                        flat
                        round
                        color="red"
                        icon="favorite"
                        @click="giveLike(publication)"
                    >
                        <q-badge color="red" floating transparent>{{
                            publication.likes.length
                        }}</q-badge>
                    </q-btn>
                </q-card-actions>
            </q-item-section>
        </q-item>

        <q-card-section>
            <div>
                {{ publication.description }}
            </div>
            <q-card-actions horizontal class="justify-end q-px-md">
                <q-chip
                    clickable
                    icon="comment"
                    @click="addComment = !addComment"
                    >Comment</q-chip
                >
            </q-card-actions>
        </q-card-section>

        <q-card-section v-if="addComment">
            <q-form @submit="saveComment" class="q-gutter-md">
                <q-input
                    type="textarea"
                    filled
                    v-model="comment"
                    label="Write a comment"
                    lazy-rules
                    :rules="[
                        (val) =>
                            (val && val.length > 0) || 'Please type something',
                    ]"
                />

                <div>
                    <q-btn label="post" type="submit" color="primary" />
                </div>
            </q-form>
        </q-card-section>

        <q-card-section v-if="publication.comments.length">
            <q-item
                v-for="comment in publication.comments"
                :key="comment"
                class="bg-grey-3 q-mt-sm"
            >
                <q-item-section avatar>
                    <q-avatar>
                        <img :src="comment.users.avatar" />
                    </q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{ comment.users.username }}</q-item-label>
                    <div>
                        {{ comment.description }}
                    </div>
                </q-item-section>

                <q-item-section>
                    <q-card-actions horizontal class="justify-end q-px-md">
                        <q-item-label caption>{{
                            comment.createAt
                        }}</q-item-label>
                    </q-card-actions>
                </q-item-section>

                <!-- <q-item-section>
                    <q-card-actions horizontal class="justify-end q-px-md">
                        <q-btn flat round color="red" icon="favorite">
                            <q-badge color="red" floating transparent>{{
                                comment.likes.length
                            }}</q-badge>
                        </q-btn>
                    </q-card-actions>
                </q-item-section> -->
            </q-item>
        </q-card-section>
    </q-card>
</template>

<script lang="ts">
import { IComment, IPublication, IUser } from 'src/interfaces/publications';
import { defineComponent, PropType, ref } from 'vue';
import { api } from 'src/boot/axios';

export default defineComponent({
    name: 'Publication',
    props: {
        publication: { type: Object as PropType<IPublication>, required: true },
    },
    emits: ['giveLike', 'addComment'],
    setup(props, { emit }) {
        // --- VARIABLES
        const showComments = ref(false);
        const addComment = ref(false);
        const comment = ref('');
        const user = localStorage.getItem('user') || '';
        const userAuth = JSON.parse(user) as IUser;

        // --- FUNCTIONS
        const giveLike = async (publication: IPublication) => {
            console.log('Publication', publication);
            const liked = publication.likes.findIndex(
                (x) => x.idUser === userAuth.idUser
            );
            let res: IPublication;
            if (liked < 0) {
                const url1 = `publications/${publication._id}/addLike`;
                res = (await api.put(url1, userAuth)).data as IPublication;
            } else {
                const url1 = `publications/${publication._id}/deleteLike`;
                res = (await api.put(url1, userAuth)).data as IPublication;
            }

            res.createAt = new Date(res.createAt).toLocaleString();
            // publications.value[index] = res;
            emit('giveLike', res);
        };

        const saveComment = async () => {
            console.log('Guardar comentario');
            const params: IComment = {
                description: comment.value,
                users: userAuth,
                likes: [],
                createAt: new Date(),
            };

            const res = (
                await api.put(
                    `publications/${props.publication._id}/addComment`,
                    params
                )
            ).data as IPublication;

            const publication = res.comments.map((x) => {
                x.createAt = new Date(x.createAt).toLocaleString();
                return x;
            });

            console.log('Save comment', publication);
            emit('addComment', publication);
        };

        // --- RETURNS
        return { giveLike, showComments, addComment, comment, saveComment };
    },
});
</script>

<style lang="scss" scoped>
.publication {
    width: 100%;
    height: 100%;
    max-width: 600px;
}
</style>
