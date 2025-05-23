"use client";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const SectionsContext = createContext();

export default function SectionsProvider({ children }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch("/api/sections");
      if (!res.ok) throw new Error("failed to fetch sections data");
      const data = await res.json();
      setSections(data);
    } catch (error) {
      setError(error);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await fetchSections();
    setLoading(false);
  }, [fetchSections]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const categories = useMemo(() => {
    return sections.flatMap((section) => section.categories || []);
  }, [sections]);

  const products = useMemo(() => {
    return categories.flatMap((category) => category.products || []);
  }, [categories]);

  const addSection = (newSection) => {
    setSections((prevSections) => [...prevSections, newSection]);
  };

  const removeSection = (deletedSection) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== deletedSection.id)
    );
  };

  const updateSection = (updatedSection) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === updatedSection.id
          ? { ...section, ...updatedSection }
          : section
      )
    );
  };

  const addCategory = (newCategory) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === newCategory.sectionid
          ? {
              ...section,
              categories: [...section.categories, newCategory],
            }
          : section
      )
    );
  };

  const removeCategory = (deletedCategory) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === deletedCategory.sectionid
          ? {
              ...section,
              categories: section.categories.filter(
                (category) => category.id !== deletedCategory.id
              ),
            }
          : section
      )
    );
  };

  const updateCategory = (updatedCategory) => {
    const oldCategory = categories.find(
      (category) => category.id === updateCategory.id
    );

    if (oldCategory.sectionid !== updatedCategory.sectionid) {
      setSections((prevSections) =>
        prevSections.map((section) => {
          if (section.id === oldCategory.sectionid) {
            return {
              ...section,
              categories: section.categories.filter(
                (category) => category.id !== oldCategory.id
              ),
            };
          }

          if (section.id === updatedCategory.sectionid) {
            return {
              ...section,
              categories: [...section.categories, updatedCategory],
            };
          }

          return section;
        })
      );
      return;
    }

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === updatedCategory.sectionid
          ? {
              ...section,
              categories: section.categories.map((category) =>
                category.id === updatedCategory.id ? updatedCategory : category
              ),
            }
          : section
      )
    );
  };

  const addProduct = (newProduct) => {
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        categories: section.categories.map((category) =>
          category.id === newProduct.categoryid
            ? {
                ...category,
                products: [...category.products, newProduct],
              }
            : category
        ),
      }))
    );
  };

  const deleteProduct = (deletedProduct) => {
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        categories: section.categories.map((category) =>
          category.id === deletedProduct.categoryid
            ? {
                ...category,
                products: category.products.filter(
                  (product) => product.id !== deletedProduct.id
                ),
              }
            : category
        ),
      }))
    );
  };

  const updateProduct = (updatedProduct) => {
    const oldProduct = products.find(
      (product) => product.id === updatedProduct.id
    );
    if (oldProduct.categoryid !== updatedProduct.categoryid) {
      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          categories: section.categories.map((category) => {
            if (category.id === oldProduct.categoryid) {
              return {
                ...category,
                products: category.products.filter(
                  (product) => product.id !== oldProduct.id
                ),
              };
            }

            if (category.id === updatedProduct.categoryid) {
              return {
                ...category,
                products: [...category.products, updatedProduct],
              };
            }

            return category;
          }),
        }))
      );
      return;
    }

    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        categories: section.categories.map((category) =>
          category.id === updatedProduct.categoryid
            ? {
                ...category,
                products: category.products.map((product) =>
                  product.id === updatedProduct.id ? updatedProduct : product
                ),
              }
            : category
        ),
      }))
    );
  };

  return (
    <SectionsContext.Provider
      value={{
        sections,
        categories,
        products,
        loading,
        error,
        setLoading,
        addSection,
        removeSection,
        updateSection,
        addCategory,
        removeCategory,
        updateCategory,
        addProduct,
        deleteProduct,
        updateProduct,
      }}
    >
      {children}
    </SectionsContext.Provider>
  );
}
