import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { Raycaster } from 'three';


@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private raycaster!: Raycaster;
  private light!: THREE.DirectionalLight;
  private mouse!: THREE.Vector2;


  private cube!: THREE.Mesh;
  private frameId?: number;

  constructor(private ngZone: NgZone) { }

  ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // transparent background,
      antialias: true // smooth edges 
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    this.scene.add(this.camera);

    this.light = new THREE.DirectionalLight(0xffffff, 0.6);
    this.light.position.z = 10;
    this.scene.add(this.light);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({color: 0xFF8001});
    this.cube = new THREE.Mesh(geometry, material);
    // this.cube.
    this.scene.add(this.cube);

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
  }

  public animate(): void {
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
      document.addEventListener('mousemove', (event) => {
        this.onMouseMove(event);
      });
      document.addEventListener('click', (event) => {
        this.onMouseClick(event);
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    // UPDATE
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    // HANDE EVENTS

    // RENDER
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public onMouseMove(event: MouseEvent) {
    // this.mouse.setX((event.clientX / window.innerHeight) * 2 - 1);
    // this.mouse.setY(- (event.clientY / window.innerHeight) * 2 + 1);
  }

  public onMouseClick(event: MouseEvent) {
    this.mouse.setX((event.clientX / window.innerHeight) * 2 - 1);
    this.mouse.setY(- (event.clientY / window.innerHeight) * 2 + 1);

    this.raycaster.setFromCamera(this.mouse, this.camera);

    var intersects = this.raycaster.intersectObjects(this.scene.children);

    for (var i = 0; i <  intersects.length; i++) {
      // let x = intersects[i].object.
      // intersects[i].object.m
    }
  }
}
// Dziwki wóda i lasery
// Czyli typowa impreza urodzinowa

// Towarzysze! Jak co roku spotykamy się wspólnie aby świętować powiększającą się liczbę dni