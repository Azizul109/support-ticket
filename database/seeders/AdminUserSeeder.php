<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@support.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create a test customer
        User::create([
            'name' => 'Test Customer',
            'email' => 'customer@test.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);
    }
}