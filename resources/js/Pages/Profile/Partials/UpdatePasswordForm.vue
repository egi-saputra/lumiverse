<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { usePage, useForm } from '@inertiajs/vue3';
import { ref, computed } from 'vue';

const page = usePage()
const hasPassword = computed(() => page.props.hasPassword)

const passwordInput = ref(null);
const currentPasswordInput = ref(null);

/* ── Show / hide toggle per field ───────────────────────── */
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const updatePassword = () => {
    form.put(route('password.update'), {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onError: () => {
            if (form.errors.password) {
                form.reset('password', 'password_confirmation');
                passwordInput.value.focus();
            }
            if (form.errors.current_password) {
                form.reset('current_password');
                currentPasswordInput.value.focus();
            }
        },
    });
};
</script>

<template>
    <section>
        <header>
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Update Password</h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Ensure your account is using a long, random password to stay secure.
            </p>
        </header>

        <form @submit.prevent="updatePassword" class="mt-6 space-y-6">

            <!-- Current Password -->
            <div v-if="hasPassword">
                <InputLabel for="current_password" value="Current Password" class="dark:text-gray-300" />
                <div class="relative mt-1">
                    <TextInput id="current_password" ref="currentPasswordInput" v-model="form.current_password"
                        :type="showCurrent ? 'text' : 'password'" autocomplete="current-password" class="block w-full pr-10
                               bg-white dark:bg-gray-800
                               border-gray-300 dark:border-gray-600
                               text-gray-900 dark:text-gray-100
                               focus:ring-indigo-500 dark:focus:ring-indigo-400" />
                    <button type="button" @click="showCurrent = !showCurrent" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600
                               dark:text-gray-500 dark:hover:text-gray-300 transition" tabindex="-1"
                        :aria-label="showCurrent ? 'Hide password' : 'Show password'">
                        <!-- Eye open -->
                        <svg v-if="!showCurrent" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5
                                   c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639
                                   C20.577 16.49 16.64 19.5 12 19.5
                                   c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <!-- Eye slash -->
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12
                                   C3.226 16.338 7.244 19.5 12 19.5
                                   c.993 0 1.953-.138 2.863-.395
                                   M6.228 6.228A10.45 10.45 0 0112 4.5
                                   c4.756 0 8.773 3.162 10.065 7.498
                                   a10.523 10.523 0 01-4.293 5.774
                                   M6.228 6.228L3 3m3.228 3.228l3.65 3.65
                                   m7.894 7.894L21 21m-3.228-3.228-3.65-3.65
                                   m0 0a3 3 0 10-4.243-4.243
                                   m4.242 4.242L9.88 9.88" />
                        </svg>
                    </button>
                </div>
                <InputError :message="form.errors.current_password" class="mt-2" />
            </div>

            <!-- New Password -->
            <div>
                <InputLabel for="password" value="New Password" class="dark:text-gray-300" />
                <div class="relative mt-1">
                    <TextInput id="password" ref="passwordInput" v-model="form.password"
                        :type="showNew ? 'text' : 'password'" autocomplete="new-password" class="block w-full pr-10
                               bg-white dark:bg-gray-800
                               border-gray-300 dark:border-gray-600
                               text-gray-900 dark:text-gray-100
                               focus:ring-indigo-500 dark:focus:ring-indigo-400" />
                    <button type="button" @click="showNew = !showNew" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600
                               dark:text-gray-500 dark:hover:text-gray-300 transition" tabindex="-1"
                        :aria-label="showNew ? 'Hide password' : 'Show password'">
                        <svg v-if="!showNew" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5
                                   c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639
                                   C20.577 16.49 16.64 19.5 12 19.5
                                   c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12
                                   C3.226 16.338 7.244 19.5 12 19.5
                                   c.993 0 1.953-.138 2.863-.395
                                   M6.228 6.228A10.45 10.45 0 0112 4.5
                                   c4.756 0 8.773 3.162 10.065 7.498
                                   a10.523 10.523 0 01-4.293 5.774
                                   M6.228 6.228L3 3m3.228 3.228l3.65 3.65
                                   m7.894 7.894L21 21m-3.228-3.228-3.65-3.65
                                   m0 0a3 3 0 10-4.243-4.243
                                   m4.242 4.242L9.88 9.88" />
                        </svg>
                    </button>
                </div>
                <InputError :message="form.errors.password" class="mt-2" />
            </div>

            <!-- Confirm Password -->
            <div>
                <InputLabel for="password_confirmation" value="Confirm Password" class="dark:text-gray-300" />
                <div class="relative mt-1">
                    <TextInput id="password_confirmation" v-model="form.password_confirmation"
                        :type="showConfirm ? 'text' : 'password'" autocomplete="new-password" class="block w-full pr-10
                               bg-white dark:bg-gray-800
                               border-gray-300 dark:border-gray-600
                               text-gray-900 dark:text-gray-100
                               focus:ring-indigo-500 dark:focus:ring-indigo-400" />
                    <button type="button" @click="showConfirm = !showConfirm" class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600
                               dark:text-gray-500 dark:hover:text-gray-300 transition" tabindex="-1"
                        :aria-label="showConfirm ? 'Hide password' : 'Show password'">
                        <svg v-if="!showConfirm" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5
                                   c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639
                                   C20.577 16.49 16.64 19.5 12 19.5
                                   c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="1.8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12
                                   C3.226 16.338 7.244 19.5 12 19.5
                                   c.993 0 1.953-.138 2.863-.395
                                   M6.228 6.228A10.45 10.45 0 0112 4.5
                                   c4.756 0 8.773 3.162 10.065 7.498
                                   a10.523 10.523 0 01-4.293 5.774
                                   M6.228 6.228L3 3m3.228 3.228l3.65 3.65
                                   m7.894 7.894L21 21m-3.228-3.228-3.65-3.65
                                   m0 0a3 3 0 10-4.243-4.243
                                   m4.242 4.242L9.88 9.88" />
                        </svg>
                    </button>
                </div>
                <InputError :message="form.errors.password_confirmation" class="mt-2" />
            </div>

            <!-- Submit -->
            <div class="flex items-center gap-4">
                <PrimaryButton :disabled="form.processing" class="flex items-center gap-2">
                    <svg v-if="form.processing" class="animate-spin w-4 h-4 text-white"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {{ form.processing ? 'Saving...' : 'Save' }}
                </PrimaryButton>

                <Transition enter-active-class="transition ease-in-out" enter-from-class="opacity-0"
                    leave-active-class="transition ease-in-out" leave-to-class="opacity-0">
                    <p v-if="form.recentlySuccessful" class="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
                </Transition>
            </div>

        </form>
    </section>
</template>