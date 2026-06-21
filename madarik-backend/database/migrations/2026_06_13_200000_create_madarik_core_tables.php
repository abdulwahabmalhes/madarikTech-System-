<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Currencies
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique();
            $table->string('name');
            $table->string('name_ar')->nullable();
            $table->string('symbol', 10);
            $table->decimal('exchange_rate', 10, 4)->default(1);
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Settings (key-value per tenant)
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('key');
            $table->longText('value')->nullable();
            $table->string('group')->default('general');
            $table->timestamps();
            $table->unique(['tenant_id', 'key']);
        });

        // Leads (CRM)
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('lead_number')->nullable();
            $table->string('name');
            $table->string('company_name')->nullable();
            $table->string('mobile');
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
            $table->string('source');
            $table->string('country')->nullable();
            $table->string('stage')->default('new');
            $table->string('priority')->default('normal');
            $table->decimal('estimated_value', 15, 2)->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->date('expected_close_date')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->unsignedBigInteger('converted_to_client_id')->nullable();
            $table->text('notes')->nullable();
            $table->json('tags')->nullable();
            $table->string('referrer_name')->nullable();
            $table->string('referrer_type')->nullable();
            $table->string('campaign_name')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'stage']);
            $table->index(['tenant_id', 'assigned_to']);
        });

        // Clients
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('name');
            $table->string('company_name')->nullable();
            $table->string('mobile');
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('industry')->nullable();
            $table->string('type')->default('individual'); // individual, company
            $table->string('status')->default('active');
            $table->string('source')->nullable();
            $table->unsignedBigInteger('lead_id')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->json('tags')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('portal_access')->default(false);
            $table->string('portal_email')->nullable();
            $table->string('portal_password')->nullable();
            $table->string('avatar')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'status']);
            $table->fullText('name');
        });

        // Project Templates
        Schema::create('project_templates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('name');
            $table->string('type')->nullable();
            $table->text('description')->nullable();
            $table->json('tasks')->nullable();
            $table->json('milestones')->nullable();
            $table->json('deliverables')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });

        // Projects
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('project_number')->nullable();
            $table->string('name');
            $table->unsignedBigInteger('client_id');
            $table->text('description')->nullable();
            $table->string('type')->default('other');
            $table->unsignedBigInteger('template_id')->nullable();
            $table->date('start_date');
            $table->date('expected_end_date');
            $table->date('actual_end_date')->nullable();
            $table->string('priority')->default('normal');
            $table->string('status')->default('planning');
            $table->unsignedTinyInteger('progress_percent')->default(0);
            $table->unsignedTinyInteger('health_score')->default(100);
            $table->unsignedBigInteger('assigned_manager')->nullable();
            $table->decimal('contract_value', 15, 2)->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->unsignedBigInteger('linked_quotation_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'client_id']);
            $table->index(['tenant_id', 'status']);
            $table->fullText('name');
        });

        // Project Members
        Schema::create('project_members', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('user_id');
            $table->string('role')->nullable();
            $table->timestamps();
            $table->unique(['project_id', 'user_id']);
        });

        // Project Milestones
        Schema::create('project_milestones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->unsignedBigInteger('project_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('due_date');
            $table->string('status')->default('pending');
            $table->boolean('payment_linked')->default(false);
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['project_id', 'status']);
        });

        // Products/Services
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('name');
            $table->string('name_ar')->nullable();
            $table->string('category');
            $table->text('description')->nullable();
            $table->text('description_ar')->nullable();
            $table->string('short_description')->nullable();
            $table->decimal('base_price', 15, 2)->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->string('pricing_model')->default('fixed');
            $table->json('features')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Quotations
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('quotation_number')->unique();
            $table->unsignedBigInteger('client_id');
            $table->string('project_name');
            $table->date('issue_date');
            $table->date('expiry_date');
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('tax_percent', 5, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->text('payment_terms')->nullable();
            $table->text('notes')->nullable();
            $table->longText('terms_conditions')->nullable();
            $table->string('status')->default('draft');
            $table->string('pdf_path')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'client_id']);
            $table->index(['tenant_id', 'status']);
            $table->fullText('project_name');
        });

        // Quotation Items
        Schema::create('quotation_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quotation_id');
            $table->unsignedBigInteger('product_id')->nullable();
            $table->string('type')->default('service');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('quantity', 10, 2)->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Contract Templates
        Schema::create('contract_templates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('name');
            $table->string('name_ar')->nullable();
            $table->string('type');
            $table->longText('content');
            $table->longText('content_ar')->nullable();
            $table->json('dynamic_fields')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });

        // Contracts
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('contract_number')->unique();
            $table->string('title');
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('quotation_id')->nullable();
            $table->string('type');
            $table->decimal('value', 15, 2)->default(0);
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->json('payment_schedule')->nullable();
            $table->unsignedBigInteger('template_id')->nullable();
            $table->longText('content')->nullable();
            $table->json('dynamic_fields')->nullable();
            $table->string('status')->default('draft');
            $table->boolean('signed_by_client')->default(false);
            $table->date('signed_date')->nullable();
            $table->string('signatory_name')->nullable();
            $table->text('notes')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'client_id']);
            $table->index(['tenant_id', 'status']);
        });

        // Invoices
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('invoice_number')->unique();
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('contract_id')->nullable();
            $table->unsignedBigInteger('quotation_id')->nullable();
            $table->date('issue_date');
            $table->date('due_date');
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('tax_percent', 5, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('remaining_amount', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->text('terms')->nullable();
            $table->string('status')->default('draft');
            $table->string('pdf_path')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'client_id']);
            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'due_date']);
        });

        // Invoice Items
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->string('description');
            $table->decimal('quantity', 10, 2)->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Payments
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->unsignedBigInteger('invoice_id');
            $table->unsignedBigInteger('client_id');
            $table->decimal('amount', 15, 2);
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->date('payment_date');
            $table->string('method')->default('bank_transfer');
            $table->string('reference')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('recorded_by')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'invoice_id']);
        });

        // Expenses
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('title');
            $table->string('category');
            $table->decimal('amount', 15, 2);
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->date('date');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('client_id')->nullable();
            $table->string('vendor')->nullable();
            $table->string('receipt_path')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'category']);
            $table->index(['tenant_id', 'project_id']);
        });

        // Tasks
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('client_id')->nullable();
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('parent_task_id')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->date('due_date')->nullable();
            $table->time('due_time')->nullable();
            $table->string('priority')->default('normal');
            $table->string('status')->default('pending');
            $table->decimal('estimated_hours', 6, 2)->nullable();
            $table->decimal('actual_hours', 6, 2)->nullable();
            $table->json('tags')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'assigned_to']);
            $table->index(['tenant_id', 'project_id']);
            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'due_date']);
        });

        // Daily Reports
        Schema::create('daily_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('title');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('client_id');
            $table->date('report_date');
            $table->string('period_type')->default('daily');
            $table->text('work_completed')->nullable();
            $table->text('issues')->nullable();
            $table->text('next_steps')->nullable();
            $table->unsignedTinyInteger('completion_percent')->default(0);
            $table->decimal('hours_logged', 6, 2)->nullable();
            $table->string('status')->default('draft');
            $table->string('pdf_path')->nullable();
            $table->string('sent_via')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'project_id']);
        });

        // Deliverables
        Schema::create('deliverables', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->unsignedBigInteger('project_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->date('due_date')->nullable();
            $table->string('status')->default('pending');
            $table->boolean('client_approval_required')->default(false);
            $table->string('client_approval_status')->nullable();
            $table->string('client_approved_by')->nullable();
            $table->timestamp('client_approved_at')->nullable();
            $table->text('client_rejection_note')->nullable();
            $table->integer('sort_order')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Meetings
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('meeting_number')->nullable();
            $table->string('title');
            $table->string('type')->default('other');
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->string('location')->nullable();
            $table->json('internal_attendees')->nullable();
            $table->json('external_attendees')->nullable();
            $table->text('agenda')->nullable();
            $table->longText('notes')->nullable();
            $table->text('decisions')->nullable();
            $table->date('next_meeting_date')->nullable();
            $table->string('status')->default('scheduled');
            $table->string('pdf_path')->nullable();
            $table->string('sent_via')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'client_id']);
        });

        // Meeting Action Items
        Schema::create('meeting_action_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('meeting_id');
            $table->unsignedBigInteger('task_id')->nullable();
            $table->text('description');
            $table->unsignedBigInteger('assigned_to_user_id')->nullable();
            $table->string('assigned_to_name')->nullable();
            $table->date('due_date')->nullable();
            $table->string('priority')->default('normal');
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        // Opportunities
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('title');
            $table->longText('description')->nullable();
            $table->string('category');
            $table->string('status')->default('idea');
            $table->decimal('estimated_revenue', 15, 2)->nullable();
            $table->decimal('estimated_cost', 15, 2)->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->string('priority')->default('normal');
            $table->date('target_date')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Reminders
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('custom');
            $table->nullableMorphs('remindable');
            $table->timestamp('remind_at');
            $table->string('repeat_type')->default('none');
            $table->json('channels')->nullable();
            $table->unsignedBigInteger('assigned_to');
            $table->string('status')->default('active');
            $table->timestamp('fired_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'remind_at']);
            $table->index(['tenant_id', 'status']);
        });

        // Knowledge Categories
        Schema::create('knowledge_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('name');
            $table->string('name_ar')->nullable();
            $table->string('slug');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Knowledge Articles
        Schema::create('knowledge_articles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('title');
            $table->string('title_ar')->nullable();
            $table->longText('content');
            $table->longText('content_ar')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_published')->default(false);
            $table->integer('version')->default(1);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->fullText('title');
        });

        // Calendar Events
        Schema::create('calendar_events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('manual');
            $table->timestamp('start_at');
            $table->timestamp('end_at')->nullable();
            $table->boolean('all_day')->default(false);
            $table->string('color')->nullable();
            $table->nullableMorphs('eventable');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'start_at']);
        });

        // Files (polymorphic)
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('name');
            $table->string('original_name');
            $table->string('path');
            $table->string('disk')->default('local');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->nullableMorphs('fileable');
            $table->boolean('is_external')->default(false);
            $table->string('external_url')->nullable();
            $table->string('external_type')->nullable();
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Notes (polymorphic)
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->text('content');
            $table->nullableMorphs('noteable');
            $table->boolean('is_private')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Activities (audit log)
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('type');
            $table->text('description')->nullable();
            $table->nullableMorphs('subject');
            $table->nullableMorphs('causer');
            $table->json('properties')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'created_at']);
        });

        // Client Communications Timeline
        Schema::create('client_communications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->unsignedBigInteger('client_id');
            $table->string('event_type');
            $table->string('channel')->nullable();
            $table->string('subject')->nullable();
            $table->text('body')->nullable();
            $table->string('direction')->default('outbound');
            $table->nullableMorphs('related');
            $table->unsignedBigInteger('performed_by')->nullable();
            $table->timestamp('performed_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'client_id']);
            $table->index(['tenant_id', 'performed_at']);
        });

        // Marketing Spend
        Schema::create('marketing_spend', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('source');
            $table->unsignedTinyInteger('month');
            $table->unsignedSmallInteger('year');
            $table->decimal('amount', 15, 2);
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->string('campaign_name')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'source', 'year', 'month']);
        });

        // Support Tickets
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('ticket_number')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->string('priority')->default('normal');
            $table->string('category')->default('general');
            $table->string('status')->default('open');
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->timestamp('sla_due_at')->nullable();
            $table->timestamp('first_response_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->string('created_via')->default('internal');
            $table->unsignedBigInteger('created_by_user_id')->nullable();
            $table->unsignedBigInteger('created_by_client_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'client_id']);
            $table->index(['tenant_id', 'status']);
        });

        // Ticket Comments
        Schema::create('ticket_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ticket_id');
            $table->string('author_type'); // user, client
            $table->unsignedBigInteger('author_id');
            $table->text('body');
            $table->boolean('is_internal')->default(false);
            $table->json('attachments')->nullable();
            $table->timestamps();

            $table->index('ticket_id');
        });

        // Renewals
        Schema::create('renewals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('name');
            $table->string('type');
            $table->unsignedBigInteger('client_id')->nullable();
            $table->unsignedBigInteger('project_id')->nullable();
            $table->string('vendor')->nullable();
            $table->decimal('cost', 15, 2)->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->date('start_date');
            $table->date('renewal_date');
            $table->string('billing_cycle')->default('annual');
            $table->boolean('auto_renews')->default(false);
            $table->json('reminder_days')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('active');
            $table->date('renewed_on')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'renewal_date']);
            $table->index(['tenant_id', 'status']);
        });

        // Goals
        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('title');
            $table->string('type');
            $table->decimal('target_value', 15, 2);
            $table->string('unit')->default('AED');
            $table->string('period_type')->default('monthly');
            $table->date('period_start');
            $table->date('period_end');
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'period_start', 'period_end']);
        });

        // Company Assets
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->string('name');
            $table->string('type');
            $table->unsignedBigInteger('client_id')->nullable();
            $table->unsignedBigInteger('project_id')->nullable();
            $table->string('provider')->nullable();
            $table->string('account_email')->nullable();
            $table->text('username')->nullable(); // encrypted
            $table->text('password')->nullable(); // encrypted
            $table->longText('notes')->nullable(); // encrypted
            $table->decimal('monthly_cost', 10, 2)->nullable();
            $table->decimal('annual_cost', 10, 2)->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();
            $table->date('purchase_date')->nullable();
            $table->date('renewal_date')->nullable();
            $table->unsignedBigInteger('managed_by')->nullable();
            $table->string('status')->default('active');
            $table->json('tags')->nullable();
            $table->unsignedBigInteger('linked_renewal_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->unsignedBigInteger('user_id');
            $table->string('type');
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('link')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'user_id', 'read_at']);
        });

        // AI Conversations
        Schema::create('ai_conversations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->default(1)->index();
            $table->unsignedBigInteger('user_id');
            $table->string('session_id');
            $table->json('messages')->nullable();
            $table->unsignedInteger('tokens_used_input')->default(0);
            $table->unsignedInteger('tokens_used_output')->default(0);
            $table->string('model_used')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'user_id']);
        });
    }

    public function down(): void
    {
        $tables = [
            'ai_conversations', 'notifications', 'assets', 'goals', 'renewals',
            'ticket_comments', 'support_tickets', 'marketing_spend', 'client_communications',
            'activities', 'notes', 'files', 'calendar_events', 'knowledge_articles',
            'knowledge_categories', 'reminders', 'opportunities', 'meeting_action_items',
            'meetings', 'deliverables', 'daily_reports', 'tasks', 'expenses', 'payments',
            'invoice_items', 'invoices', 'contracts', 'contract_templates', 'quotation_items',
            'quotations', 'products', 'project_milestones', 'project_members', 'projects',
            'project_templates', 'clients', 'leads', 'settings', 'currencies',
        ];

        foreach ($tables as $table) {
            Schema::dropIfExists($table);
        }
    }
};
