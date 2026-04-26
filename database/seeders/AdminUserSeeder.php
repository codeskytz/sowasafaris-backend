<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->firstOrNew([
            'email' => 'admin@sowasafaris.com',
        ]);

        $admin->forceFill([
            'name' => 'Sowa Safaris Admin',
            'email_verified_at' => now(),
            'is_admin' => true,
            'password' => Hash::make('sowasafaris@2026'),
        ])->save();
    }
}
