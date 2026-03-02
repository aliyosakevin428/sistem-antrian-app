<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCounterRequest;
use App\Http\Requests\UpdateCounterRequest;
use App\Http\Requests\BulkUpdateCounterRequest;
use App\Http\Requests\BulkDeleteCounterRequest;
use App\Models\Counter;
use App\Models\Queue;
use App\Models\QueueCall;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CounterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->pass("index counter");

        $data = Counter::query()
            ->with(['services'])
            ->when($request->name, function($q, $v){
                $q->where('name', $v);
            });

        return Inertia::render('counter/index', [
            'counters' => $data->get(),
            'services' => Service::select( 'id','name')->get(),
            'query' => $request->input(),
            'permissions' => [
                'canAdd' => $this->user->can("create counter"),
                'canShow' => $this->user->can("show counter"),
                'canUpdate' => $this->user->can("update counter"),
                'canDelete' => $this->user->can("delete counter"),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCounterRequest $request)
    {
        $this->pass("create counter");

        $data = $request->validated();

        $services = $data['services'] ?? [];
        unset($data['services']);

        $counter = Counter::create($data);

        $counter->services()->sync($services);
    }

    /**
     * Display the specified resource.
     */
    public function show(Counter $counter)
    {
        $this->pass("show counter");

        $counter->load('services');

        $waitingCount = Queue::whereIn(
            'service_id',
            $counter->services->pluck('id')
        )
        ->where('status', 'waiting')
        ->count();

        $todayServed = QueueCall::where('counter_id', $counter->id)
            ->whereDate('created_at', today())
            ->count();

        return Inertia::render('counter/show', [
            'counter' => [
                'id' => $counter->id,
                'name' => $counter->name,
                'is_active' => $counter->is_active,
                'waiting' => $waitingCount,
                'today_served' => $todayServed,
                'operational_started_at' => $counter->operational_started_at,
                'break_started_at' => $counter->break_started_at,
            ],
            'permissions' => [
                'canUpdate' => $this->user->can("update counter"),
                'canDelete' => $this->user->can("delete counter"),
            ]
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCounterRequest $request, Counter $counter)
    {
        $this->pass("update counter");

        $data = $request->validated();

        $services = $data['services'] ?? [];
        unset($data['services']);

        $counter->update($data);

        $counter->services()->sync($services);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Counter $counter)
    {
        $this->pass("delete counter");

        $counter->delete();
    }

    /**
     * BulkUpdate the specified resource from storage.
     */
    public function bulkUpdate(BulkUpdateCounterRequest $request)
    {
        $this->pass("update counter");

        $data = $request->validated();
        $ids = $data['counter_ids'];
        unset($data['counter_ids']);

        Counter::whereIn('id', $ids)->update($data);
    }

    /**
     * BulkDelete the specified resource from storage.
     */
    public function bulkDelete(BulkDeleteCounterRequest $request)
    {
        $this->pass("delete counter");

        $data = $request->validated();
        Counter::whereIn('id', $data['counter_ids'])->delete();
    }

    /**
     * View archived resource from storage.
     */
    public function archived()
    {
        $this->pass("archived counter");

        return Inertia::render('counter/archived', [
            'counters' => Counter::onlyTrashed()->get(),
        ]);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        $this->pass("restore counter");

        $model = Counter::onlyTrashed()->findOrFail($id);
        $model->restore();
    }

    /**
     * Force delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $this->pass("force delete counter");

        $model = Counter::onlyTrashed()->findOrFail($id);
        $model->forceDelete();
    }

    public function toggleStatus(Counter $counter)
    {
        if ($counter->is_active) {
        // Masuk break
        $counter->update([
            'is_active' => false,
            'break_started_at' => now(),
        ]);
        } else {
            // Aktif kembali
            $counter->update([
                'is_active' => true,
                'operational_started_at' => now(),
                'break_started_at' => null,
            ]);
        }

        return back();
    }


}
