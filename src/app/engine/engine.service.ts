import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
// import * as THREE from 'three';
import { Mesh, Raycaster, WebGLRenderer, PerspectiveCamera, Scene, DirectionalLight, Vector2, Color, BoxGeometry, MeshLambertMaterial, Material } from 'three';


@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas!: HTMLCanvasElement;
  private renderer!: WebGLRenderer;
  private camera!: PerspectiveCamera;
  private scene!: Scene;
  private raycaster!: Raycaster;
  private light!: DirectionalLight;
  private mouse!: Vector2;


  private cube!: Mesh;
  private frameId?: number;

  constructor(private ngZone: NgZone) { }

  ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    this.canvas = canvas.nativeElement;

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // transparent background,
      antialias: true // smooth edges 
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new Scene();
    this.scene.background = new Color(0x000000);

    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    this.scene.add(this.camera);

    this.light = new DirectionalLight(0xffffff, 0.6);
    this.light.position.z = 10;
    this.scene.add(this.light);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({color: 0xFF8001});
    this.cube = new Mesh(geometry, material);
    // this.cube.
    this.scene.add(this.cube);

    this.mouse = new Vector2();
    this.raycaster = new Raycaster();
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
    this.mouse.setY(-(event.clientY / window.innerHeight) * 2 + 1);

    console.log(this.mouse);

    this.raycaster.setFromCamera(this.mouse, this.camera);

    var intersects = this.raycaster.intersectObjects(this.scene.children);

    for (var i = 0; i <  intersects.length; i++) {
      // intersects[0].object
      // console.log(intersects[0]);

      // NOTE: THERE IS A PROBLEM WITH TYPE DEFINITION LIBRARY FOR THREEJS (@Types/three)

      // let x = ((intersects[i].object as Mesh).material as Material).color
      // console.log(intersects[i]);
      // ((intersects[i].object as Mesh).material as Material).
      // let x = intersects[i].object as Mesh;
      // x.material.

      // console.log(x.material.color.set(0x40f032));
    }
  }
}