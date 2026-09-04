import { useState, useRef } from 'react';
import { Upload, Plus, Database, AlertTriangle, FileJson, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Parcel } from '../data/mockData';
import { motion } from 'framer-motion';

export const AdminPage = () => {
  const { parcels, addParcel, addParcelsBulk } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
  
  const [formData, setFormData] = useState<Partial<Parcel>>({
    name: '',
    state: '',
    district: '',
    village: '',
    khasraId: '',
    riskScore: 0,
    predictedDelayMonths: 0,
    currentStage: 'Notification',
    causes: [],
    recommendation: '',
    coordinates: [20, 78]
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          // Add some basic validation here if needed
          const newParcels = json.map(item => ({
            ...item,
            id: item.id || `uploaded-${Date.now()}-${Math.random()}`
          })) as Parcel[];
          
          addParcelsBulk(newParcels);
          setUploadStatus({ type: 'success', message: `Successfully added ${newParcels.length} parcels.` });
        } else {
          setUploadStatus({ type: 'error', message: 'JSON must be an array of parcel objects.' });
        }
      } catch (error) {
        setUploadStatus({ type: 'error', message: 'Invalid JSON file format.' });
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'riskScore' || name === 'predictedDelayMonths' ? Number(value) : value
    }));
  };

  const handleCoordinatesChange = (idx: 0 | 1, value: string) => {
    setFormData(prev => {
      const newCoords = [...(prev.coordinates || [20, 78])] as [number, number];
      newCoords[idx] = Number(value);
      return { ...prev, coordinates: newCoords };
    });
  };

  const handleCausesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const causesArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, causes: causesArray }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParcel: Parcel = {
      ...(formData as Parcel),
      id: `manual-${Date.now()}`,
    };
    addParcel(newParcel);
    
    // Reset form
    setFormData({
      name: '', state: '', district: '', village: '', khasraId: '',
      riskScore: 0, predictedDelayMonths: 0, currentStage: 'Notification',
      causes: [], recommendation: '', coordinates: [20, 78]
    });
    setUploadStatus({ type: 'success', message: 'Parcel added successfully via manual entry.' });
    
    setTimeout(() => {
      setUploadStatus({ type: 'idle', message: '' });
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-text-main flex items-center gap-3">
          <Database className="w-8 h-8 text-primary" />
          Data Management
        </h1>
        <p className="text-text-muted mt-2 text-lg">Upload new land records or manually enter parcel data into the system.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        
        {/* Left Column: Bulk Upload */}
        <div className="flex flex-col gap-6">
          <div className="bg-ink border border-border rounded-xl p-8 h-full flex flex-col">
            <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
              <FileJson className="w-5 h-5 text-primary-light" />
              Bulk JSON Upload
            </h2>
            
            <div 
              className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-10 transition-colors cursor-pointer ${
                dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-text-muted hover:bg-surface'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".json" 
                className="hidden" 
                onChange={(e) => e.target.files && processFile(e.target.files[0])}
              />
              <Upload className={`w-12 h-12 mb-4 transition-colors ${dragActive ? 'text-primary' : 'text-text-muted'}`} />
              <p className="text-text-main font-medium text-lg mb-2">Drag and drop your JSON file here</p>
              <p className="text-text-muted text-sm text-center max-w-sm">
                Ensure the JSON array matches the standard Parcel schema. The data will instantly reflect on the dashboard maps.
              </p>
              <button className="mt-6 px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium hover:bg-border transition-colors">
                Browse Files
              </button>
            </div>

            {uploadStatus.type !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg flex items-start gap-3 border ${
                  uploadStatus.type === 'success' ? 'bg-primary/10 border-primary/20 text-primary-light' : 'bg-risk-high/10 border-risk-high/20 text-risk-high'
                }`}
              >
                {uploadStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-medium">{uploadStatus.message}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Manual Entry Form */}
        <div className="bg-ink border border-border rounded-xl p-8">
          <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-light" />
            Manual Data Entry
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1">Project / Parcel Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-surface border border-border rounded p-2.5 text-text-main focus:border-primary outline-none transition-colors" placeholder="e.g. NH-44 Expansion Sec A" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase mb-1">State</label>
                <input required name="state" value={formData.state} onChange={handleChange} type="text" className="w-full bg-surface border border-border rounded p-2.5 text-text-main focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase mb-1">District</label>
                <input required name="district" value={formData.district} onChange={handleChange} type="text" className="w-full bg-surface border border-border rounded p-2.5 text-text-main focus:border-primary outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase mb-1">Village</label>
                <input required name="village" value={formData.village} onChange={handleChange} type="text" className="w-full bg-surface border border-border rounded p-2.5 text-text-main focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase mb-1">Khasra ID</label>
                <input required name="khasraId" value={formData.khasraId} onChange={handleChange} type="text" className="w-full bg-surface border border-border rounded p-2.5 text-text-main focus:border-primary outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase mb-1">Risk Score (0-100)</label>
                <input required name="riskScore" value={formData.riskScore} onChange={handleChange} type="number" min="0" max="100" className="w-full bg-surface border border-border rounded p-2.5 text-text-main focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase mb-1">Predicted Delay (Mo)</label>
                <input required name="predictedDelayMonths" value={formData.predictedDelayMonths} onChange={handleChange} type="number" min="0" className="w-full bg-surface border border-border rounded p-2.5 text-text-main focus:border-primary outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1">Current Stage</label>
              <select name="currentStage" value={formData.currentStage} onChange={handleChange} className="w-full bg-surface border border-border rounded p-2.5 text-text-main focus:border-primary outline-none appearance-none">
                <option>Notification</option>
                <option>Social Impact Assessment</option>
                <option>Award</option>
                <option>Compensation</option>
                <option>Possession</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-muted uppercase mb-1">Causes (Comma separated)</label>
              <input name="causes" value={formData.causes?.join(', ')} onChange={handleCausesChange} type="text" className="w-full bg-surface border border-border rounded p-2.5 text-text-main focus:border-primary outline-none" placeholder="Title Dispute, Multiple Heirs" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase mb-1">Latitude</label>
                <input required value={formData.coordinates?.[0] || ''} onChange={(e) => handleCoordinatesChange(0, e.target.value)} type="number" step="any" className="w-full bg-surface border border-border rounded p-2.5 text-text-main focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-muted uppercase mb-1">Longitude</label>
                <input required value={formData.coordinates?.[1] || ''} onChange={(e) => handleCoordinatesChange(1, e.target.value)} type="number" step="any" className="w-full bg-surface border border-border rounded p-2.5 text-text-main focus:border-primary outline-none" />
              </div>
            </div>

            <button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-md transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add Parcel to Database
            </button>
          </form>
        </div>
      </div>
      
      {/* Live Data Preview */}
      <div className="mt-12 bg-ink border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold text-text-main mb-6">Current Database ({parcels.length} records)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-muted">
            <thead className="text-xs uppercase bg-surface border-b border-border font-mono">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {parcels.slice(0, 10).map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-surface/50">
                  <td className="px-4 py-3 font-mono text-xs">{p.khasraId}</td>
                  <td className="px-4 py-3 text-text-main font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p.village}, {p.state}</td>
                  <td className="px-4 py-3 text-xs uppercase">{p.currentStage}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs border ${p.riskScore >= 70 ? 'bg-risk-high/10 border-risk-high text-risk-high' : p.riskScore >= 40 ? 'bg-risk-medium/10 border-risk-medium text-risk-medium' : 'bg-risk-low/10 border-risk-low text-risk-low'}`}>
                      {p.riskScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {parcels.length > 10 && (
            <div className="p-4 text-center text-xs text-text-muted italic">Showing 10 most recent records...</div>
          )}
        </div>
      </div>
    </div>
  );
};
