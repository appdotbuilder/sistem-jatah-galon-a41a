<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->foreignId('employee_id')->nullable()->constrained('employees');
            $table->string('action')->comment('Action performed');
            $table->text('description')->comment('Description of the action');
            $table->json('old_values')->nullable()->comment('Old values before change');
            $table->json('new_values')->nullable()->comment('New values after change');
            $table->string('ip_address')->nullable()->comment('IP address');
            $table->string('user_agent')->nullable()->comment('User agent');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'created_at']);
            $table->index(['employee_id', 'created_at']);
            $table->index('action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};