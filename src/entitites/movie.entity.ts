import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('movie')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'title' })
  title: string;

  @Column({ type: 'int', name: 'episode_id' })
  episodeId: number;

  @Column({ type: 'varchar', name: 'opening_crawl' })
  openingCrawl: string;

  @Column({ type: 'varchar' })
  director: string;

  @Column({ type: 'varchar' })
  producer: string;

  @Column({ type: 'date', name: 'release_date' })
  releaseDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  constructor(partial: Partial<Movie>) {
    Object.assign(this, partial);
  }
}
