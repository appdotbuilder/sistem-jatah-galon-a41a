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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique()->comment('Employee ID for scanning');
            $table->string('nama_lengkap')->comment('Full name');
            $table->string('nik')->unique()->comment('Employee identification number');
            $table->enum('grade', ['G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13'])->comment('Employee grade');
            $table->string('department')->comment('Department name');
            $table->string('jabatan')->comment('Position/job title');
            $table->string('foto')->nullable()->comment('Profile photo path');
            $table->string('email')->nullable()->comment('Email address');
            $table->string('hp')->nullable()->comment('Phone number');
            $table->date('hire_date')->comment('Date joined company');
            $table->integer('monthly_quota')->comment('Monthly gallon quota based on grade');
            $table->integer('current_quota')->default(0)->comment('Current month remaining quota');
            $table->integer('total_taken_current_month')->default(0)->comment('Total taken this month');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('employee_id');
            $table->index('nik');
            $table->index('grade');
            $table->index('department');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};