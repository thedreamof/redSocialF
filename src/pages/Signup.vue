<template>
    <div class="login-content row justify-center items-center">
         <div v-if="loading">
            <q-spinner-puff color="primary" size="2em" />
            <q-tooltip :offset="[0, 8]">Loading</q-tooltip>
        </div>
        <q-card flat bordered class="login">
            <q-card-section>
                <div class="text-h6">Welcome to new red</div>
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
                        lazy-rules
                        :rules="[
                            (val) =>
                                (val && val.length > 0) ||
                                'Please type your username',
                        ]"
                    />

                    <q-input
                        type="password"
                        filled
                        v-model="password"
                        label="Your password *"
                        hint="Password"
                        lazy-rules
                        :rules="[
                            (val) =>
                                (val && val.length > 0) ||
                                'Please type your password',
                        ]"
                    />

                    <q-input
                        type="password"
                        filled
                        v-model="repeatPassword"
                        label="Your password *"
                        hint="Password"
                        lazy-rules
                        :rules="[
                            (val) =>
                                (val && val.length > 0) ||
                                'Please type your password',
                            (val) =>
                                val === password || 'Your passwords not match',
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

                    <q-toggle
                        v-model="accept"
                        label="I accept the license and terms"
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
    </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { defineComponent, toRefs, reactive, ref } from 'vue';

export default defineComponent({
    name: 'Signup',
    setup() {
        
        // --- VARIABLES
        const $q = useQuasar();
        const router = useRouter();
        const form = reactive({
            name: null,
            lastname: null,
            username: null,
            password: null,
            repeatPassword: null,
            description: null,
            accept: false,
        });
        const loading = ref(false);

        // --- FUNCTIONS
        const auth = async () => {
            const params = { username: form.username, password: form.password };
            const res: { token: string; payload: unknown } = (
                await api.post('auth/login', params)
            ).data as { token: string; payload: unknown };

            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.payload));
            void router.push({ name: 'Publications' });
        };

        const onSubmit = async () => {
            loading.value = true;
            if (form.accept !== true) {
                $q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'warning',
                    message: 'You need to accept the license and terms first',
                });
            } else {
                const params = {
                    name: form.name,
                    lastname: form.lastname,
                    username: form.username,
                    password: form.password,
                    description: form.description,
                    accept: form.accept,
                };

                try {
                    const res: unknown = (await api.post('auth/signup', params))
                        .data;
                    if (res) {
                        $q.notify({
                            color: 'green-4',
                            textColor: 'white',
                            icon: 'cloud_done',
                            message: 'Welcome!!',
                        });

                        void auth();
                    }

                    void router.push({ name: 'Publications' });
                } catch (error) {
                    $q.notify({
                        color: 'red-5',
                        textColor: 'white',
                        icon: 'error',
                        message: 'Error try again',
                    });
                }
            }
            loading.value = false;
        };

        const onReset = () => {
            form.name = null;
            form.lastname = null;
            form.username = null;
            form.password = null;
            form.repeatPassword = null;
            form.description = null;
            form.accept = false;
        };

        // --- RETURNS
        return { ...toRefs(form), onSubmit, onReset, loading };
    },
});
</script>

<style lang="scss" scoped>
.login-content {
    background: linear-gradient(64deg, steelblue, lightgray);
    height: 100vh;
}

.login {
    width: 100%;
    max-width: 400px;
}
</style>
