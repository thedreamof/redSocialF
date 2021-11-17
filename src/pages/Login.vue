/* eslint-disable @typescript-eslint/no-unsafe-member-access */
<template>
    <div class="login-content row justify-center items-center">
        <q-card flat bordered class="login">
            <q-card-section>
                <div class="text-h6">Login</div>
            </q-card-section>

            <q-separator inset=""></q-separator>

            <q-card-section>
                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                    <q-input
                        filled
                        v-model="username"
                        label="Your username"
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
                        label="Your password"
                        hint="password"
                        lazy-rules
                        :rules="[
                            (val) =>
                                (val && val.length > 0) ||
                                'Please type your password',
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

            <q-separator inset=""></q-separator>

            <q-card-section>
                Are you have not register?
                    <q-chip
                        clickable
                        @click="goSignUp"
                        color="primary"
                        text-color="white"
                    >
                        Click here!
                    </q-chip>
            </q-card-section>
        </q-card>
    </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
    setup() {
        // --- VARIABLES
        const $q = useQuasar();
        const router = useRouter();
        const form = reactive({
            username: '',
            password: '',
        });

        // --- FUNCTIONS
        const onSubmit = async () => {
            try {
                const params = form;
                const res: { token: string; payload: unknown } = (
                    await api.post('auth/login', params)
                ).data as { token: string; payload: unknown };

                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.payload));
                void router.push({ name: 'Publications' });
            } catch (error: any) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const err = error.message as string;
                $q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'error',
                    message: err || 'Error try again',
                });
            }
        };

        const onReset = () => {
            form.username = '';
            form.password = '';
        };

        const goSignUp = () => {
            void router.push({ name: 'Signup' });
        };

        // --- RETURNS
        return { ...toRefs(form), onSubmit, onReset, goSignUp };
    },
});
</script>

<style lang="scss" scoped>
.login-content {
    height: 100vh;
}

.login {
    width: 100%;
    max-width: 400px;
}
</style>
