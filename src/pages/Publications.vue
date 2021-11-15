<template>
    <!-- <div class="q-page q-pa-md row justify-center items-center q-gutter-md"> -->
    <q-page padding class="q-gutter-md flex flex-center">
        <q-card class="publication" v-for="item in publications" :key="item">
            <q-item>
                <q-item-section avatar>
                    <q-avatar>
                        <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                    </q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{item.userCreated.userName}}</q-item-label>
                    <q-item-label caption>{{item.title}}</q-item-label>
                </q-item-section>

                <q-item-section>
                    <q-card-actions horizontal class="justify-end q-px-md">
                        <q-btn flat round color="red" icon="favorite">
                            <q-badge color="red" floating transparent>22</q-badge>
                        </q-btn>
                    </q-card-actions>
                </q-item-section>

                
            </q-item>

            <!-- <img src="https://cdn.quasar.dev/img/parallax2.jpg" /> -->

            <q-card-section>
                {{item.description}}
            </q-card-section>
        </q-card>        
    </q-page>
    <!-- <div class="q-page q-layout-padding flex flex-center q-gutter-md" style="max-height: 100vh;">
    </div> -->
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Publications',
    setup() {
        const publications = ref<Array<unknown>>([]);

        const getPublications = async () => {
            const res: Array<unknown> = (await api.get('/publications')).data as Array<unknown>;
            console.log(res);

            res.push(res[0]);
            res.push(res[0]);
            res.push(res[0]);
            res.push(res[0]);
            res.push(res[0]);
            res.push(res[0]);
            
            publications.value = res;
        };

        void getPublications();

        return { publications };
    },
});
</script>

<style lang="scss" scoped>
.publication {
    width: 100%;
    // min-width: 350px;
    max-width: 600px;
}
</style>
