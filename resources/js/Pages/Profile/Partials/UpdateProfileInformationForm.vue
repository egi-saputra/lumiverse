<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Link, useForm, usePage } from '@inertiajs/vue3';

defineProps({
    mustVerifyEmail: { type: Boolean },
    status: { type: String },
});

const user = usePage().props.auth.user;

const form = useForm({
    name: user.name,
    email: user.email,
});
</script>

<template>
    <section>
        <header>
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Update your account's profile information and email address.
            </p>
        </header>

        <form @submit.prevent="form.patch(route('profile.update'))" class="mt-6 space-y-6">

            <!-- Name -->
            <div>
                <InputLabel for="name" value="Name" class="dark:text-gray-300" />
                <TextInput id="name" type="text" v-model="form.name" required autofocus autocomplete="name" class="mt-1 block w-full
                           bg-white dark:bg-gray-800
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100
                           focus:ring-indigo-500 dark:focus:ring-indigo-400" />
                <InputError class="mt-2" :message="form.errors.name" />
            </div>

            <!-- Email -->
            <div>
                <InputLabel for="email" value="Email" class="dark:text-gray-300" />
                <TextInput id="email" type="email" v-model="form.email" required autocomplete="username" class="mt-1 block w-full
                           bg-white dark:bg-gray-800
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100
                           focus:ring-indigo-500 dark:focus:ring-indigo-400" />
                <InputError class="mt-2" :message="form.errors.email" />
            </div>

            <!-- Email verification notice -->
            <div v-if="mustVerifyEmail && user.email_verified_at === null">
                <p class="text-sm mt-2 text-gray-800 dark:text-gray-400">
                    Your email address is unverified.
                    <Link :href="route('verification.send')" method="post" as="button" class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900
                               rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Click here to re-send the verification email.
                    </Link>
                </p>
                <div v-show="status === 'verification-link-sent'"
                    class="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                    A new verification link has been sent to your email address.
                </div>
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