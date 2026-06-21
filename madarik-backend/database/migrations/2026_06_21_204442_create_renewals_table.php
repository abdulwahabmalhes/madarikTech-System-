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
        Schema::create('renewals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->unsignedBigInteger('client_id')->nullable();
            $table->unsignedBigInteger('project_id')->nullable();
            
            $table->string('type'); // domain, hosting, maintenance, subscription, other
            $table->string('name');
            $table->text('description')->nullable();
            
            $table->date('start_date');
            $table->date('expiry_date');
            
            $table->decimal('cost', 15, 2)->default(0); // The cost we pay
            $table->decimal('price', 15, 2)->default(0); // The price client pays
            
            $table->string('status')->default('active'); // active, expired, renewed, cancelled
            $table->boolean('auto_renew')->default(false);
            $table->text('notes')->nullable();
            
            $table->timestamps();

            // Foreign keys
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('set null');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('renewals');
    }
};
