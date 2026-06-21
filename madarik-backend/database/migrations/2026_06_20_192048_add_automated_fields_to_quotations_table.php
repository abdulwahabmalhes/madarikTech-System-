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
        Schema::table('quotations', function (Blueprint $table) {
            $table->text('project_overview')->nullable();
            $table->text('project_goals')->nullable();
            $table->string('project_type')->nullable();
            $table->integer('execution_days')->nullable();
            $table->date('delivery_date')->nullable();
            $table->string('support_duration')->nullable();
            $table->json('support_includes')->nullable();
            $table->json('support_excludes')->nullable();
            $table->json('ui_ux_design')->nullable();
            $table->json('deliverables')->nullable();
            $table->json('payment_mechanism')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->dropColumn([
                'project_overview',
                'project_goals',
                'project_type',
                'execution_days',
                'delivery_date',
                'support_duration',
                'support_includes',
                'support_excludes',
                'ui_ux_design',
                'deliverables',
                'payment_mechanism',
            ]);
        });
    }
};
