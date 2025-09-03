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
        Schema::create('gallon_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->enum('status', ['pending', 'approved', 'provided', 'rejected'])->default('pending');
            $table->enum('type', ['input', 'output'])->comment('Request type: input=request, output=collection');
            $table->timestamp('requested_at')->useCurrent()->comment('When request was made');
            $table->timestamp('approved_at')->nullable()->comment('When request was approved');
            $table->timestamp('provided_at')->nullable()->comment('When gallon was provided');
            $table->timestamp('verified_at')->nullable()->comment('When collection was verified');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->foreignId('provided_by')->nullable()->constrained('users');
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['employee_id', 'status']);
            $table->index(['status', 'type']);
            $table->index(['requested_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallon_requests');
    }
};