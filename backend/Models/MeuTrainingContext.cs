using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class MeuTrainingContext : DbContext
{
    public MeuTrainingContext()
    {
    }

    public MeuTrainingContext(DbContextOptions<MeuTrainingContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Type> Types { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=MeuTraining");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Brand__3213E83F72F85D69");

            entity.ToTable("Brand");

            entity.HasIndex(e => e.Name, "UQ__Brand__72E12F1B98962DF6").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(28)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Product__3213E83F172D7879");

            entity.ToTable("Product");

            entity.HasIndex(e => e.Code, "UQ__Product__357D4CF91DE16CF5").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BrandId).HasColumnName("brand_id");
            entity.Property(e => e.Category)
                .HasMaxLength(28)
                .IsUnicode(false)
                .HasColumnName("category");
            entity.Property(e => e.Code)
                .HasMaxLength(9)
                .IsUnicode(false)
                .HasColumnName("code");
            entity.Property(e => e.Description)
                .HasMaxLength(180)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(90)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.TypeId).HasColumnName("type_id");

            entity.HasOne(d => d.Brand).WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .HasConstraintName("FK__Product__brand_i__3E52440B");

            entity.HasOne(d => d.Type).WithMany(p => p.Products)
                .HasForeignKey(d => d.TypeId)
                .HasConstraintName("FK__Product__type_id__3F466844");
        });

        modelBuilder.Entity<Type>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Type__3213E83F24ADD96E");

            entity.ToTable("Type");

            entity.HasIndex(e => e.Name, "UQ__Type__72E12F1BB8BB82C1").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(21)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}