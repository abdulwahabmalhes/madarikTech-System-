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
        Schema::create('incomes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('title');
            $table->string('category')->default('general');
            $table->decimal('amount', 15, 2);
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->date('date');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('client_id')->nullable();
            $table->string('source')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['tenant_id', 'category']);
            $table->index(['tenant_id', 'project_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incomes');
    }
};
