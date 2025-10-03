<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->text('description');
            $table->enum('category', ['technical', 'billing', 'general', 'feature_request']);
            $table->enum('priority', ['low', 'medium', 'high', 'urgent']);
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->string('attachment')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_admin_id')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tickets');
    }
};