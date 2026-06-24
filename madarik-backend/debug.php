<?php
echo "PROJECTS:\n";
$projects = \App\Models\Project::get(['id', 'name', 'status']);
foreach($projects as $p) { echo "- ID: {$p->id}, Name: {$p->name}, Status: {$p->status}\n"; }

echo "\nTASKS:\n";
$tasks = \App\Models\Task::get(['id', 'title', 'status', 'due_date']);
foreach($tasks as $t) { echo "- ID: {$t->id}, Title: {$t->title}, Status: {$t->status}, Due: {$t->due_date}\n"; }

echo "\nINVOICES:\n";
$invoices = \App\Models\Invoice::get(['id', 'total_amount', 'status']);
foreach($invoices as $i) { echo "- ID: {$i->id}, Amount: {$i->total_amount}, Status: {$i->status}\n"; }

echo "\nPAYMENTS (Revenue):\n";
$payments = \App\Models\Payment::get(['id', 'amount', 'payment_date']);
foreach($payments as $p) { echo "- ID: {$p->id}, Amount: {$p->amount}, Date: {$p->payment_date}\n"; }

echo "\nEXPENSES:\n";
$expenses = \App\Models\Expense::get(['id', 'amount', 'date']);
foreach($expenses as $e) { echo "- ID: {$e->id}, Amount: {$e->amount}, Date: {$e->date}\n"; }
