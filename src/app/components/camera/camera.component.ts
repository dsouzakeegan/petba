import { CommonModule } from '@angular/common';
import { CameraPreview } from '@capacitor-community/camera-preview';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, LoadingController, ModalController } from '@ionic/angular';
import { CameraOutputComponent } from '../camera-output/camera-output.component';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  imports: [ IonicModule, CommonModule ],
  standalone: true
})
export class CameraComponent  {
  isCameraActive = false;
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: BlobPart[] = [];
  progress: number = 0;
  interval: any;
  showTickButton: boolean = false;

  // Variable to store the response from the backend
  predictionResponse: any;
  alertButtons: any;

  // Variables for custom overlay
  showMessage = false;
  messageText = '';

  constructor(
    private http: HttpClient,
    private loadingController: LoadingController,
    private modalController: ModalController,
  ) {
    console.log('Constructor: Initializing component');
    this.openCamera();
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit: Component view initialized');
    this.enableProgressBar();
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave: Leaving the view, releasing camera');
    this.closeCamera();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy: Component is being destroyed, releasing camera');
    this.closeCamera();
  }

  enableProgressBar() {
    console.log('enableProgressBar: Initializing progress bar');
    const progressbar = document.querySelector('.progressbar') as HTMLElement;
    progressbar.setAttribute('role', 'progressbar');
    progressbar.setAttribute('aria-valuenow', '0');
    progressbar.setAttribute('aria-live', 'polite');
  }

  openCamera() {
    if (this.isCameraActive) {
      console.log('openCamera: Camera is already active');
      return;
    }

    console.log('openCamera: Attempting to open camera');
    const cameraPreviewSettings = {
      parent: 'cameraPreview',
      disableAudio: true, // Disable audio since we're only previewing
      position: 'rear',
      className: 'cameraPreview',
      toBack: true,
      quality: 100,
      width: window.screen.width,
      height: window.screen.height,
    };

    CameraPreview.start(cameraPreviewSettings).then(() => {
      console.log('openCamera: Camera started successfully for preview');
      this.isCameraActive = true;
    }).catch((err) => {
      console.error('openCamera: Failed to start camera preview', err);
      alert('Failed to access the camera for preview. Please ensure no other apps are using the camera.');
    });
  }

  async closeCamera() {
    if (!this.isCameraActive) {
      console.log('closeCamera: Camera is not active, no need to stop');
      return;
    }

    console.log('closeCamera: Attempting to close camera');
    await CameraPreview.stop();
    this.isCameraActive = false;
    console.log('closeCamera: Camera stopped');
  }

  async startAudioRecording() {
    console.log('startAudioRecording: Start recording initiated');
    if (this.isRecording) {
      console.log('startAudioRecording: Recording is already in progress');
      return; // Prevent starting a new recording while one is ongoing
    }

    this.isRecording = true;
    this.showTickButton = false;
    this.progress = 0;
    this.updateProgress();

    try {
      const stream = await (navigator.mediaDevices as any).getUserMedia({
        audio: true, // Capture audio only
      });
      console.log('startAudioRecording: Media stream obtained for audio');

      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event) => {
        console.log('startAudioRecording: Data available from media recorder');
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        console.log('startAudioRecording: Recording stopped');
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        this.recordedChunks = [];

        this.isRecording = false; // Reset the recording state after saving the file
        this.showTickButton = true; // Show the tick button after recording ends

        await this.convertAudioToWav(blob); // Convert audio to WAV
      };

      this.mediaRecorder.start();
      console.log('startAudioRecording: MediaRecorder started for audio');

      setTimeout(() => {
        this.stopAudioRecording();
      }, 10000); // 10000 milliseconds = 10 seconds
    } catch (error) {
      console.error('startAudioRecording: Error while starting audio recording', error);
    }
  }

  stopAudioRecording() {
    console.log('stopAudioRecording: Stop recording initiated');
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      console.log('stopAudioRecording: MediaRecorder stopped');
    }
    clearInterval(this.interval);
  }

  updateProgress() {
    console.log('updateProgress: Updating progress');
    this.interval = setInterval(() => {
      this.progress += 1;
      if (this.progress >= 100) {
        clearInterval(this.interval);
        console.log('updateProgress: Progress complete');
      }
      document.documentElement.style.setProperty('--progress', `${this.progress * 3.6}deg`);
    }, 100); // Update progress every 100 milliseconds
  }

  async convertAudioToWav(audioBlob: Blob) {
    console.log('convertAudioToWav: Converting audio blob to WAV');
    try {
      const audioContext = new AudioContext();
      const audioBuffer = await audioBlob.arrayBuffer();
      const decodedAudioBuffer = await audioContext.decodeAudioData(audioBuffer);

      const wavBlob = this.audioBufferToWav(decodedAudioBuffer);

      const audioUrl = URL.createObjectURL(wavBlob);
      // const a = document.createElement('a');
      // a.href = audioUrl;
      // a.download = 'recorded-audio.wav';
      // a.click();

      // Post the audio file
      this.postAudioFile(wavBlob);
    } catch (error) {
      console.error('convertAudioToWav: Error during conversion', error);
    }
  }

  audioBufferToWav(buffer: AudioBuffer): Blob {
    console.log('audioBufferToWav: Converting audio buffer to WAV format');
    const numOfChan = buffer.numberOfChannels,
      length = buffer.length * numOfChan * 2 + 44,
      bufferArray = new ArrayBuffer(length),
      view = new DataView(bufferArray),
      channels = [],
      sampleRate = buffer.sampleRate,
      sampleBits = 16;

    let offset = 0;

    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    // Write WAV header
    writeString(view, offset, 'RIFF');
    offset += 4;
    view.setUint32(offset, length - 8, true);
    offset += 4;
    writeString(view, offset, 'WAVE');
    offset += 4;
    writeString(view, offset, 'fmt ');
    offset += 4;
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, numOfChan, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, sampleRate * numOfChan * 2, true);
    offset += 4;
    view.setUint16(offset, numOfChan * 2, true);
    offset += 2;
    view.setUint16(offset, sampleBits, true);
    offset += 2;
    writeString(view, offset, 'data');
    offset += 4;
    view.setUint32(offset, length - offset - 4, true);
    offset += 4;

    // Write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    for (let i = 0; i < buffer.length; i++) {
      for (let j = 0; j < numOfChan; j++) {
        const sample = Math.max(-1, Math.min(1, channels[j][i]));
        view.setInt16(
          offset,
          sample < 0 ? sample * 0x8000 : sample * 0x7FFF,
          true
        );
        offset += 2;
      }
    }

    console.log('audioBufferToWav: WAV conversion completed');
    return new Blob([bufferArray], { type: 'audio/wav' });
  }

  async postAudioFile(wavBlob: Blob) {
    console.log('postAudioFile: Posting audio file to server');
    const loading = await this.loadingController.create({
      spinner: 'circles',
      cssClass: 'custom-loading',
      showBackdrop: false,
      backdropDismiss: false,
    });
    await loading.present();
    
    const formData = new FormData();
    
    formData.append('file', wavBlob, 'pain_check.wav');
    
    this.http.post('http://82.112.236.118:4500', formData).subscribe(
      async (response: any) => {
        console.log('postAudioFile: File uploaded successfully', response);
        this.predictionResponse = response; // Store the response in the variabl
        await loading.dismiss(); // Dismiss the loading spinner
        this.handleResponse(this.predictionResponse); // Handle the response after spinner ends
      },
      async (error) => {
        console.error('postAudioFile: File upload failed', error);// Log the error
        await loading.dismiss(); // Ensure the loading spinner is dismissed on error
      }
    );
  }

  // Function to handle the response and show custom overlay
  async handleResponse(response: any) {
    console.log('handleResponse: Response received:', response); // Log the entire response object

    // Extract the 'prediction' key from the response
    const type = response.prediction;
    console.log('handleResponse: Extracted type:', type); // Log the extracted type

    let message = '';
    let imageUrl = '';

    // Determine the message and image based on the response type
    switch (type) {
      case 'aggressive':
        message = 'Your pet seems to be feeling aggressive. It might be a good idea to give them some space or identify what might be bothering them.';
        imageUrl = 'assets/images/angry.png'; // Path to the angry image
        break;
      case 'howling':
        message = 'Your pet is howling. They might be trying to communicate something important, or perhaps they feel lonely or anxious.';
        imageUrl = 'assets/images/howling.png'; // Path to the howling image
        break;
      case 'pain':
        message = 'Your pet appears to be in pain. Please check on them immediately to ensure they are safe and comfortable.';
        imageUrl = 'assets/images/pain.png'; // Path to the pain image
        break;
      case 'whining':
        message = 'Your pet is whining. They might be seeking attention or feeling uncomfortable. A little comfort could go a long way.';
        imageUrl = 'assets/images/whinning.png'; // Path to the whining image
        break;
      case 'happy':
        message = 'Your pet seems happy and content! It looks like they’re in a good mood right now.';
        imageUrl = 'assets/images/happy.png'; // Path to the happy image
        break;
      default:
        message = 'We couldn’t determine your pet’s mood. Please try again.';
        imageUrl = ''; // No image for unknown types
    }

    console.log('handleResponse: Message to display:', message); // Log the final message
    console.log('handleResponse: Image to display:', imageUrl); // Log the image path

    const modal = await this.modalController.create({
      component: CameraOutputComponent,
      componentProps: {
        message: message,
        imageUrl: imageUrl
      }
    });

    await modal.present();
    console.log('handleResponse: Modal presented');
  }

  refreshPage() {
    console.log('refreshPage: Refreshing page');
    this.showMessage = false;
    window.location.reload();
  }

  goBack() {
    // Implement the back navigation logic
    console.log('goBack: Back button clicked');
    window.history.back(); // or use this.navController.back() if using NavController
  }

  anotherFunction() {
    // Implement the function to be called when the tick button is clicked
    console.log('anotherFunction: Another function triggered');
    this.showTickButton = false;
  }
}
