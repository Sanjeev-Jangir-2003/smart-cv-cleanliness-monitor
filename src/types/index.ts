export interface ToiletZone {
  id: string;
  name: string;
  location: string;
  lastUpdated: Date;
  cleanlinessScore: number;
  status: 'Clean' | 'Moderately Dirty' | 'Dirty';
  zones: {
    floor: number;
    toiletSeat: number;
    sink: number;
    dustbin: number;
  };
  predictedDirtyTime: Date;
  alertsActive: boolean;
}

export interface CleanlinessData {
  timestamp: Date;
  score: number;
  toiletId: string;
}

export interface Alert {
  id: string;
  toiletId: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  resolved: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: number;
  uploadedAt: Date;
}

export interface ProcessingResult {
  id: string;
  fileId: string;
  cleanlinessScore: number;
  status: 'Clean' | 'Moderately Dirty' | 'Dirty';
  zones: {
    floor: { score: number; detections: BoundingBox[] };
    toiletSeat: { score: number; detections: BoundingBox[] };
    sink: { score: number; detections: BoundingBox[] };
    dustbin: { score: number; detections: BoundingBox[] };
  };
  processedAt: Date;
  processingTime: number;
  modelConfidence: number;
  alertTriggered: boolean;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  label: string;
}

export interface DetectionResult {
  zone: string;
  confidence: number;
  dirtLevel: number;
  lastDetection: Date;
}