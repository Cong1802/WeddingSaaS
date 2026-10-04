<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('auth:admin {email}', function () {
    $email = strtolower(trim($this->argument('email')));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $this->error('Invalid email.');
        return 1;
    }
    $password = $this->secret('New admin password (at least 12 characters, letters and numbers)');
    if (!is_string($password) || strlen($password) < 12 || strlen($password) > 128
        || !preg_match('/[a-zA-Z]/', $password) || !preg_match('/[0-9]/', $password)) {
        $this->error('Password does not meet the requirements.');
        return 1;
    }
    \Illuminate\Support\Facades\DB::transaction(function () use ($email, $password) {
        $user = \App\Models\User::firstOrNew(['email' => $email]);
        $user->name = $user->name ?: 'Administrator';
        $user->role = 'admin';
        $user->password = \Illuminate\Support\Facades\Hash::make($password);
        $user->save();
        $user->tokens()->delete();
    });
    $this->info('Admin account secured; previous tokens revoked.');
    return 0;
})->purpose('Create or secure an admin account using a hidden password prompt');

\Illuminate\Support\Facades\Schedule::command('sanctum:prune-expired --hours=24')->daily();
