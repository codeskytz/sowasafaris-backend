import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-[#2d2619]">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="admin@sowasafaris.com"
                                    className="border-[#d8c8a8] bg-white/80"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label
                                        htmlFor="password"
                                        className="text-[#2d2619]"
                                    >
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <a
                                            href={request().url}
                                            className="ml-auto text-sm font-semibold text-[#0f3d31] underline-offset-4 hover:underline"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </a>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="border-[#d8c8a8] bg-white/80"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm text-[#6e6049]"
                                >
                                    Remember this expedition desk
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 h-11 w-full rounded-full bg-[#0f3d31] font-bold text-[#fff7df] shadow-lg shadow-[#0f3d31]/20 hover:bg-[#173f34]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Enter Sowa Admin
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-[#6e6049]">
                                New admin users should be created by the site
                                owner.
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 rounded-2xl border border-[#0f3d31]/15 bg-[#0f3d31]/10 px-4 py-3 text-center text-sm font-medium text-[#0f3d31]">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to Sowa Admin',
    description: 'Use the staff credentials to manage Sowa Safaris.',
};
