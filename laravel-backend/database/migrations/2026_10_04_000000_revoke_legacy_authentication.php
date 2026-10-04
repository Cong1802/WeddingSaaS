<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        // Previous Google IDs were supplied by clients without verification.
        // Existing sessions must reauthenticate after this security rollout.
        DB::transaction(function () {
            DB::table('personal_access_tokens')->delete();
            DB::table('users')->whereNotNull('google_id')->update(['google_id' => null]);
            foreach (DB::table('users')->where('role', 'admin')->whereNotNull('password')->get() as $user) {
                if (Hash::check('password123', $user->password)) {
                    DB::table('users')->where('id', $user->id)->update(['password' => null, 'remember_token' => null]);
                }
            }
        });
    }

    public function down(): void
    {
        // Revoked credentials and unverified identities must not be restored.
    }
};
